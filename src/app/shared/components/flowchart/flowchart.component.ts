import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlowchartStep } from '../../interfaces/flowchart.interface';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})

export class FlowchartComponent implements OnChanges {
  showSuccess = false;
  currentMessage = '';
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
  blockGapY = 100;
  blockGapX = 220;
  decisionPoints = '';
  svgConnections: ({ x1: number, y1: number, x2: number, y2: number, isLoop?: boolean, isActive?: boolean } | { points: { x: number, y: number }[], isLoop?: boolean, isActive?: boolean })[] = [];
  svgBlocks: { step: FlowchartStep, x: number, y: number, isActive?: boolean }[] = [];

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
    // Mostrar toast si se completó el diagrama
    if (this.visibleSteps.length > 0 && this.getStepById(this.currentStepId)?.type === 'end') {
      this.showSuccess = true;
      this.currentMessage = '¡Diagrama de flujo completado! Has visualizado todos los pasos del proceso 🎉';
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }
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
    const currentActiveId = this.history.length > 0 ? this.history[this.history.length - 1] : null;
    for (let i = 0; i < this.visibleSteps.length; i++) {
      const step = this.visibleSteps[i];
      const isLastVisible = (i === this.visibleSteps.length - 1);
      if (blockPositions[step.id] && !isLastVisible) {
        lastX = blockPositions[step.id].x;
        lastY = blockPositions[step.id].y;
        // Si es loopBack, siempre usar polyline con quiebres
        if (step.loopBack && lastDecisionBlock) {
          // Calcular puntos para quiebres horizontales y verticales
          const startX = lastX + this.blockWidth / 2;
          const startY = lastY + this.blockHeight;
          const endX = lastDecisionBlock.x + this.blockWidth / 2;
          const endY = lastDecisionBlock.y + this.blockHeight / 2;
          // Quiebre horizontal, vertical, horizontal
          const breakOffsetY = 40; // Separación vertical del quiebre
          const breakOffsetX = 80; // Separación horizontal del quiebre
          let midY = startY + breakOffsetY;
          let midX1 = startX;
          let midX2 = endX;
          if (startX < endX) {
            midX1 = startX + breakOffsetX;
            midX2 = endX - breakOffsetX;
          } else if (startX > endX) {
            midX1 = startX - breakOffsetX;
            midX2 = endX + breakOffsetX;
          }
          const points = [
            { x: startX, y: startY },
            { x: midX1, y: midY },
            { x: midX2, y: midY },
            { x: endX, y: endY }
          ];
          this.svgConnections.push({
            points,
            isLoop: true,
            isActive: step.id === currentActiveId
          });
        }
        continue;
      }
      if (blockPositions[step.id] && isLastVisible) {
        lastX = blockPositions[step.id].x;
        lastY = blockPositions[step.id].y;
        this.svgBlocks.push({ step, x: lastX, y: lastY, isActive: step.id === currentActiveId });
        continue;
      }
      if (i === 0) {
        this.svgBlocks.push({ step, x: x0, y: y0, isActive: step.id === currentActiveId });
        lastX = x0;
        lastY = y0;
        blockPositions[step.id] = { x: x0, y: y0 };
        if (step.type === 'decision') {
          lastDecisionBlock = { x: x0, y: y0 };
        }
      } else {
        const prev = this.visibleSteps[i - 1];
          if (prev.type === 'decision') {
            let x = lastX;
            let y = lastY + this.blockGapY;
            let startX, startY;
            if (prev.branches && prev.branches.yes === step.id) {
              x = lastX + branchOffset;
              // Punta derecha del rombo
              startX = lastX + this.blockWidth;
              startY = lastY + this.blockHeight / 2;
            } else if (prev.branches && prev.branches.no === step.id) {
              x = lastX - branchOffset;
              // Punta izquierda del rombo
              startX = lastX;
              startY = lastY + this.blockHeight / 2;
            } else {
              // Fallback: centro inferior
              startX = lastX + this.blockWidth / 2;
              startY = lastY + this.blockHeight;
            }
            this.svgBlocks.push({ step, x, y, isActive: step.id === currentActiveId });
            blockPositions[step.id] = { x, y };
            // Conexión condicional: horizontal primero, luego vertical
            const endX = x + this.blockWidth / 2;
            const endY = y + this.blockHeight / 2;
            // Solo dos quiebres: horizontal hasta la mitad del bloque destino, luego vertical
            const points = [
              { x: startX, y: startY },
              { x: endX, y: startY }, // horizontal
              { x: endX, y: endY }    // vertical
            ];
            this.svgConnections.push({
              points,
              isActive: step.id === currentActiveId
            });
            lastX = x;
            lastY = y;
            if (step.type === 'decision') {
              lastDecisionBlock = { x, y };
            }
        } else {
          let x = lastX;
          let y = lastY + this.blockGapY;
          this.svgBlocks.push({ step, x, y, isActive: step.id === currentActiveId });
          blockPositions[step.id] = { x, y };
          this.svgConnections.push({
            x1: lastX + this.blockWidth / 2,
            y1: lastY + this.blockHeight,
            x2: x + this.blockWidth / 2,
            y2: y,
            isActive: step.id === currentActiveId
          });
          lastX = x;
          lastY = y;
          if (step.type === 'decision') {
            lastDecisionBlock = { x, y };
          }
        }
        // Si es loopBack, usar polyline con quiebres (no línea diagonal)
        if (step.loopBack && lastDecisionBlock) {
          // Trayectoria: vertical abajo, horizontal, vertical arriba
          const startX = lastX + this.blockWidth / 2;
          const startY = lastY + this.blockHeight;
          const endX = lastDecisionBlock.x + this.blockWidth / 2;
          const endY = lastDecisionBlock.y + this.blockHeight / 2;
          const offsetY = 60; // cuánto baja antes de girar
          const points = [
            { x: startX, y: startY }, // punto de salida (abajo del bloque)
            { x: startX, y: startY + offsetY }, // baja en vertical
            { x: endX, y: startY + offsetY },   // mueve en horizontal
            { x: endX, y: endY }                // sube en vertical hasta el destino
          ];
          this.svgConnections.push({
            points,
            isLoop: true,
            isActive: step.id === currentActiveId
          });
        }
      }
    }
    // Para decisiones, el rombo
    this.decisionPoints = `${this.blockWidth/2},0 ${this.blockWidth},${this.blockHeight/2} ${this.blockWidth/2},${this.blockHeight} 0,${this.blockHeight/2}`;
    // Ajustar alto del SVG
    this.svgHeight = y0 + this.svgBlocks.length * this.blockGapY + this.blockHeight;
  }

  isPolyline(conn: any): boolean {
    return !!conn.points && Array.isArray(conn.points);
  }

  isLine(conn: any): boolean {
    return conn.x1 !== undefined && conn.y1 !== undefined && conn.x2 !== undefined && conn.y2 !== undefined;
  }

  getPolylinePoints(conn: any): string {
    if (conn.points && Array.isArray(conn.points)) {
      return conn.points.map((p: { x: number; y: number }) => `${p.x},${p.y}`).join(' ');
    }
    return '';
  }

  getLineCoords(conn: any): { x1: number, y1: number, x2: number, y2: number } | null {
    if (conn.x1 !== undefined && conn.y1 !== undefined && conn.x2 !== undefined && conn.y2 !== undefined) {
      return { x1: conn.x1, y1: conn.y1, x2: conn.x2, y2: conn.y2 };
    }
    return null;
  }
  getBlockColor(type: string): string {
    switch (type) {
      case 'decision': return '#fef3c7';
      case 'end': return '#bbf7d0';
      case 'start': return '#bbf7d0';
      case 'process': return '#d1fae5'; // light green for process blocks
      default: return '#d1fae5'; // fallback to light green
    }
  }

  previousStep(): void {
    if (this.history.length > 1) {
      this.history.pop();
      this.currentStepId = this.history[this.history.length - 1];
      this.updateVisibleSteps();
    }
  }

  nextStep(): void {
    if (!this.steps || this.steps.length === 0 || this.currentStepId === null) return;
    const currentStep = this.getStepById(this.currentStepId);
    if (!currentStep) return;
    if (currentStep.type === 'decision') return;
    let nextId: number | null = null;
    if (typeof currentStep.next === 'number') {
      nextId = currentStep.next;
    } else if (typeof currentStep.loopBack === 'number') {
      nextId = currentStep.loopBack;
    }
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

  nextStepAvailable(): boolean {
    if (this.currentStepId === null) return false;
    const currentStep = this.getStepById(this.currentStepId);
    if (!currentStep) return false;
    if (currentStep.type === 'decision' || currentStep.type === 'end') return false;
    if (typeof currentStep.next === 'number' || typeof currentStep.loopBack === 'number') return true;
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

  resetDiagram(): void {
    this.resetSteps();
    this.updateSVGLayout();
  }
}
