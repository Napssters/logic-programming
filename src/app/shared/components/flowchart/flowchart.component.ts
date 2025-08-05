import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlowchartStep } from '../../interfaces/flowchart.interface';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnChanges {
  @Input() steps: FlowchartStep[] = [];
  @Input() title: string = '';

  // Control de navegación paso a paso
  currentStepIndex: number = 0;
  visibleSteps: FlowchartStep[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['steps'] && this.steps) {
      // Reiniciar la navegación cuando cambien los pasos
      this.currentStepIndex = 0;
      this.updateVisibleSteps();
      console.log('Flowchart steps updated:', this.steps);
    }
  }

  // Actualizar los pasos visibles basado en el índice actual
  updateVisibleSteps(): void {
    if (this.steps.length > 0) {
      this.visibleSteps = this.steps.slice(0, this.currentStepIndex + 1);
    } else {
      this.visibleSteps = [];
    }
  }

  // Navegación paso a paso
  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.updateVisibleSteps();
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.updateVisibleSteps();
    }
  }

  // Reiniciar el diagrama
  resetSteps(): void {
    this.currentStepIndex = 0;
    this.updateVisibleSteps();
  }

  // Getters para controlar la navegación
  get canGoNext(): boolean {
    return this.currentStepIndex < this.steps.length - 1;
  }

  get canGoPrevious(): boolean {
    return this.currentStepIndex > 0;
  }

  get canReset(): boolean {
    return this.currentStepIndex > 0;
  }

  get progressText(): string {
    return `Paso ${this.currentStepIndex + 1} de ${this.steps.length}`;
  }

  get progressPercentage(): number {
    if (this.steps.length === 0) return 0;
    return Math.round(((this.currentStepIndex + 1) / this.steps.length) * 100);
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

  getDecisionBranches(currentIndex: number): { yes: number | null, no: number | null } {
    // Lógica simplificada para decisiones
    // En una decisión, "Sí" va al siguiente paso, "No" puede saltar o repetir
    const nextIndex = currentIndex + 1;
    const hasNext = nextIndex < this.steps.length;

    return {
      yes: hasNext ? nextIndex + 1 : null,
      no: currentIndex + 2 < this.steps.length ? currentIndex + 2 : null
    };
  }
}
