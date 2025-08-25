import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlowchartStep } from '../../interfaces/flowchart.interface';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})

export class FlowchartComponent implements OnChanges {
  get progressPercentage(): number {
    if (!this.steps || this.steps.length === 0) return 0;
    // Calcular el total de pasos únicos recorridos en el flujo actual
    const uniqueSteps = Array.from(new Set(this.history)).length;
  // Si el flujo terminó en un paso de tipo 'end', mostrar 100%
  const currentStep = this.getStepById(this.currentStepId!);
  if (currentStep && currentStep.type === 'end') return 100;
    // Si hay bucles, nunca pasar de 100%
    return Math.min(100, Math.round((uniqueSteps / this.steps.length) * 100));
  }
  @Input() steps: FlowchartStep[] = [];
  @Input() title: string = '';

  currentStepId: number | null = null;
  visibleSteps: FlowchartStep[] = [];
  history: number[] = [];

  // SVG layout helpers
  svgWidth = 800;
  svgHeight = 300;
  blockWidth = 140;
  blockHeight = 60;
  blockGapY = 80;
  blockGapX = 220;
  decisionPoints = '';
  svgConnections: { x1: number, y1: number, x2: number, y2: number, isLoop?: boolean }[] = [];
  svgBlocks: { step: FlowchartStep, x: number, y: number }[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['steps'] && this.steps) {
      this.resetSteps();
    }
    this.updateSVGLayout();
  }

  ngOnInit() {
    this.resetSteps();
    this.updateSVGLayout();
  }

  getStepById(id: number): FlowchartStep | undefined {
    return this.steps.find(s => s.id === id);
  }

  // Inicializa el diagrama en el primer paso
  resetSteps(): void {
    if (this.steps.length > 0) {
      this.currentStepId = this.steps[0].id;
      this.history = [this.currentStepId];
      this.updateVisibleSteps();
    } else {
      this.currentStepId = null;
      this.history = [];
      this.visibleSteps = [];
    }
  }

  // Actualiza los pasos visibles según el historial
  updateVisibleSteps(): void {
    this.visibleSteps = this.history.map(id => this.getStepById(id)).filter(Boolean) as FlowchartStep[];
    this.updateSVGLayout();
  }

  updateSVGLayout(): void {
    // Calcula posiciones para cada bloque visible
    this.svgBlocks = [];
    this.svgConnections = [];
    let x0 = this.svgWidth / 2 - this.blockWidth / 2;
    let y0 = 30;
    let lastX = x0;
    let lastY = y0;
    let branchOffset = this.blockGapX;
    let lastDecisionBlock: { x: number, y: number } | null = null;
    const blockPositions: { [id: number]: { x: number, y: number } } = {};
    for (let i = 0; i < this.visibleSteps.length; i++) {
      const step = this.visibleSteps[i];
      // Si el paso ya existe, reutiliza su posición pero si es el último visible, agrégalo como último para mostrar los botones
      const isLastVisible = (i === this.visibleSteps.length - 1);
      if (blockPositions[step.id] && !isLastVisible) {
        lastX = blockPositions[step.id].x;
        lastY = blockPositions[step.id].y;
        // Si el paso actual tiene loopBack, dibujar flecha al último decision guardado
        if (step.loopBack && lastDecisionBlock) {
          this.svgConnections.push({
            x1: lastX + this.blockWidth / 2,
            y1: lastY + this.blockHeight,
            x2: lastDecisionBlock.x + this.blockWidth / 2,
            y2: lastDecisionBlock.y + this.blockHeight / 2,
            isLoop: true
          });
        }
        continue;
      }
      // Si es el último visible y ya existe, agrégalo como último para mostrar los botones
      if (blockPositions[step.id] && isLastVisible) {
        lastX = blockPositions[step.id].x;
        lastY = blockPositions[step.id].y;
        this.svgBlocks.push({ step, x: lastX, y: lastY });
        // No agregues conexiones ni actualices lastDecisionBlock
        continue;
      }
      if (i === 0) {
        this.svgBlocks.push({ step, x: x0, y: y0 });
        lastX = x0;
        lastY = y0;
        blockPositions[step.id] = { x: x0, y: y0 };
        if (step.type === 'decision') {
          lastDecisionBlock = { x: x0, y: y0 };
        }
      } else {
        // Si el anterior es decision, ramifica
        const prev = this.visibleSteps[i - 1];
        if (prev.type === 'decision') {
          let x = lastX;
          if (prev.branches && prev.branches.yes === step.id) x = lastX + branchOffset;
          if (prev.branches && prev.branches.no === step.id) x = lastX - branchOffset;
          let y = lastY + this.blockGapY;
          this.svgBlocks.push({ step, x, y });
          blockPositions[step.id] = { x, y };
          this.svgConnections.push({
            x1: lastX + this.blockWidth / 2,
            y1: lastY + this.blockHeight,
            x2: x + this.blockWidth / 2,
            y2: y
          });
          lastX = x;
          lastY = y;
          if (step.type === 'decision') {
            lastDecisionBlock = { x, y };
          }
        } else {
          // Secuencial: debajo del anterior
          let x = lastX;
          let y = lastY + this.blockGapY;
          this.svgBlocks.push({ step, x, y });
          blockPositions[step.id] = { x, y };
          this.svgConnections.push({
            x1: lastX + this.blockWidth / 2,
            y1: lastY + this.blockHeight,
            x2: x + this.blockWidth / 2,
            y2: y
          });
          lastX = x;
          lastY = y;
          if (step.type === 'decision') {
            lastDecisionBlock = { x, y };
          }
        }
        // Si el paso actual tiene loopBack, dibujar flecha al último decision guardado
        if (step.loopBack && lastDecisionBlock) {
          this.svgConnections.push({
            x1: lastX + this.blockWidth / 2,
            y1: lastY + this.blockHeight,
            x2: lastDecisionBlock.x + this.blockWidth / 2,
            y2: lastDecisionBlock.y + this.blockHeight / 2
          });
        }
      }
    }
    // Para decisiones, el rombo
    this.decisionPoints = `${this.blockWidth/2},0 ${this.blockWidth},${this.blockHeight/2} ${this.blockWidth/2},${this.blockHeight} 0,${this.blockHeight/2}`;
    // Ajustar alto del SVG
    this.svgHeight = y0 + this.svgBlocks.length * this.blockGapY + this.blockHeight;
  }

  getBlockColor(type: string): string {
    switch (type) {
      case 'start': return '#bbf7d0';
      case 'process': return '#dbeafe';
      case 'decision': return '#fef3c7';
      case 'end': return '#bbf7d0';
      default: return '#f3f4f6';
    }
  }

  // Navegación hacia atrás
  previousStep(): void {
    if (this.history.length > 1) {
      this.history.pop();
      this.currentStepId = this.history[this.history.length - 1];
      this.updateVisibleSteps();
    }
  }

  // Navegación normal (proceso, inicio, fin)
  nextStep(): void {
    // Si el diagrama es secuencial (sin next/branches/loopBack), avanzar por índice
    if (!this.steps || this.steps.length === 0 || this.currentStepId === null) return;
    const currentStep = this.getStepById(this.currentStepId);
    if (!currentStep) return;

    // Si el paso es decisión, espera la elección
    if (currentStep.type === 'decision') return;

    // Si el paso tiene next/loopBack, navega por id
    let nextId: number | null = null;
    if (typeof currentStep.next === 'number') {
      nextId = currentStep.next;
    } else if (typeof currentStep.loopBack === 'number') {
      nextId = currentStep.loopBack;
    }

    // Si no tiene next/loopBack, avanzar por índice (compatibilidad secuencial)
    if (!nextId) {
      const currentIndex = this.steps.findIndex(s => s.id === this.currentStepId);
      if (currentIndex < this.steps.length - 1) {
        nextId = this.steps[currentIndex + 1].id;
      }
    }

    if (nextId) {
      this.currentStepId = nextId;
      this.history.push(nextId);
      this.updateVisibleSteps();
    }
  }

  // Elegir rama en decisión
  chooseBranch(option: 'yes' | 'no'): void {
    const currentStep = this.getStepById(this.currentStepId!);
    if (!currentStep || currentStep.type !== 'decision') return;
  const branchId = currentStep.branches && typeof currentStep.branches[option] === 'number' ? currentStep.branches[option] : null;
    if (branchId) {
      this.currentStepId = branchId;
      this.history.push(branchId);
      this.updateVisibleSteps();
    }
  }


  // Indica si hay un siguiente paso disponible (no es decisión ni fin)
  nextStepAvailable(): boolean {
    if (this.currentStepId === null) return false;
    const currentStep = this.getStepById(this.currentStepId);
    if (!currentStep) return false;
    if (currentStep.type === 'decision' || currentStep.type === 'end') return false;
    // Si tiene next/loopBack, puede avanzar
    if (typeof currentStep.next === 'number' || typeof currentStep.loopBack === 'number') return true;
    // Si no tiene, verifica si hay un siguiente paso por índice (secuencial)
    const currentIndex = this.steps.findIndex(s => s.id === this.currentStepId);
    return currentIndex < this.steps.length - 1;
  }

  get canGoPrevious(): boolean {
    return this.history.length > 1;
  }

  get canReset(): boolean {
    return this.history.length > 1;
  }

  get progressText(): string {
    const currentStep = this.getStepById(this.currentStepId!);
    if (!currentStep) return '';
    const totalSteps = this.steps.length;
    const currentIndex = this.history.length;
    return `Paso ${currentIndex} de ${totalSteps}`;
  }

  // Reiniciar el diagrama
  resetDiagram(): void {
    this.resetSteps();
    this.updateSVGLayout();
  }
}
