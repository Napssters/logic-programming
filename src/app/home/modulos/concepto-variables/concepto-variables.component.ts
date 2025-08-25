import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowchartStep } from '../../../shared/interfaces/flowchart.interface';
import { FlowchartComponent } from '../../../shared/components/flowchart/flowchart.component';
import { BlocklyExercise, BlocklyExerciseData } from '../../../shared/interfaces/blockly.interface';

interface Example {
  title: string;
  description: string;
  question: string;
  steps: FlowchartStep[];
}

interface VariablesData {
  variables: {
    examples: Example[];
    rtlGifts?: string;
  };
}

@Component({
  selector: 'app-concepto-variables',
  templateUrl: './concepto-variables.component.html',
  styleUrls: ['./concepto-variables.component.css']
})
export class ConceptoVariablesComponent implements OnInit {
  urlGifts: string = '';
  @ViewChild('flowchartRef') flowchartComponent!: FlowchartComponent;

  // Propiedad para controlar qué sección está activa
  activeSection: string | null = 'examples';

  // Propiedades para los ejemplos
  examples: Example[] = [];
  currentExampleIndex: number = 0;
  currentExample: Example | null = null;

  // Propiedades para los ejercicios de Blockly
  blocklyExercises: BlocklyExercise[] = [];
  currentBlocklyExerciseIndex: number = 0;
  completedExercises: Set<string> = new Set();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadExamples();
    this.loadBlocklyExercises();
  }

  loadExamples(): void {
    this.http.get<VariablesData>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        this.examples = data.variables.examples;
        this.currentExample = this.examples[0];
        console.log('Variables examples loaded:', this.examples.length);
      },
      error: (error) => {
        console.error('Error cargando ejemplos de variables:', error);
      }
    });
  }

  loadBlocklyExercises(): void {
    this.http.get<any>('assets/jsons-base/blockly-exercises.json').subscribe({
      next: (data) => {
        if (data.variables && data.variables.exercises) {
          this.blocklyExercises = data.variables.exercises;
          this.urlGifts = data.variables?.rtlGifts || '';
          console.log('Blockly exercises loaded:', this.blocklyExercises.length);
        }
      },
      error: (error) => {
        console.error('Error cargando ejercicios de Blockly:', error);
        this.urlGifts = '';
      }
    });
  }

  /**
   * Muestra la sección de ejemplos
   */
  showExamples(): void {
    this.activeSection = 'examples';
  }

  /**
   * Muestra la sección de práctica/ejercicios
   */
  showPractice(): void {
    this.activeSection = 'practice';
  }

  // Navegación entre ejemplos
  previousExample(): void {
    if (this.currentExampleIndex > 0) {
      this.currentExampleIndex--;
      this.currentExample = this.examples[this.currentExampleIndex];
      this.resetFlowchart();
    }
  }

  nextExample(): void {
    if (this.currentExampleIndex < this.examples.length - 1) {
      this.currentExampleIndex++;
      this.currentExample = this.examples[this.currentExampleIndex];
      this.resetFlowchart();
    }
  }

  // Reiniciar el diagrama de flujo cuando cambie el ejemplo
  private resetFlowchart(): void {
    // Usar setTimeout para asegurar que el ViewChild esté disponible
    setTimeout(() => {
      if (this.flowchartComponent) {
        this.flowchartComponent.resetSteps();
      }
    }, 0);
  }

  // Getters para deshabilitar botones
  get canGoPreviousExample(): boolean {
    return this.currentExampleIndex > 0;
  }

  get canGoNextExample(): boolean {
    return this.currentExampleIndex < this.examples.length - 1;
  }

  // Getter para obtener los pasos del ejemplo actual
  get currentExampleSteps(): FlowchartStep[] {
    return this.currentExample?.steps || [];
  }

  // Manejo de ejercicios de Blockly
  onExerciseCompleted(event: { exerciseId: string, success: boolean }): void {
    if (event.success) {
      this.completedExercises.add(event.exerciseId);
      console.log('Ejercicio completado:', event.exerciseId);
    }
  }

  onNextBlocklyExercise(): void {
    this.currentBlocklyExerciseIndex++;
  }

  onPreviousBlocklyExercise(): void {
    if (this.currentBlocklyExerciseIndex > 0) {
      this.currentBlocklyExerciseIndex--;
    }
  }
}
