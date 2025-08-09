import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlowchartStep } from '../../interfaces/flowchart.interface';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})

export class FlowchartComponent implements OnChanges {
  ngOnInit() {
    this.resetSteps();
  }
  @Input() steps: FlowchartStep[] = [];
  @Input() title: string = '';

  currentStepId: number | null = null;
  visibleSteps: FlowchartStep[] = [];
  history: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['steps'] && this.steps) {
      this.resetSteps();
    }
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
    if (currentStep && currentStep.type === 'end') {
      return `Diagrama completado`;
    }
    return `Paso ${this.visibleSteps.length} de ${this.steps.length}`;
  }

  get progressPercentage(): number {
    if (this.steps.length === 0) return 0;
    const currentStep = this.getStepById(this.currentStepId!);
    // Si está en el último paso (tipo 'end'), mostrar 100%
    if (currentStep && currentStep.type === 'end') {
      return 100;
    }
    // Limitar el progreso máximo a 99% si no ha terminado
    const percent = Math.round((this.visibleSteps.length / this.steps.length) * 100);
    return percent > 99 ? 99 : percent;
  }

  getStepClass(type: string): string {
    const baseClasses = 'inline-block p-3 rounded-lg shadow-md border-2 mb-3 mx-auto min-w-[150px] text-center transition-all duration-300 hover:shadow-lg';
    switch (type) {
      case 'start':
        return `${baseClasses} bg-green-100 border-green-400 text-green-800`;
      case 'process':
        return `${baseClasses} bg-blue-100 border-blue-400 text-blue-800`;
      case 'decision':
        return `${baseClasses} bg-yellow-100 border-yellow-400 text-yellow-800 transform rotate-45`;
      case 'end':
        return `${baseClasses} bg-green-100 border-green-400 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-400 text-gray-800`;
    }
  }

  getStepIcon(type: string): string {
    switch (type) {
      case 'start':
        return '🟢';
      case 'process':
        return '📦';
      case 'decision':
        return '🤔';
      case 'end':
        return '✅';
      default:
        return '📝';
    }
  }

  isDecision(type: string): boolean {
    return type === 'decision';
  }
}
