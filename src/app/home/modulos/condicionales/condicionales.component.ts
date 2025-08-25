import { Component, OnInit, Type } from '@angular/core';
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

interface CondicionalesData {
  condicionales: {
    examples: Example[];
    rtlGifts?: string;
  };
}

@Component({
  selector: 'app-condicionales',
  templateUrl: './condicionales.component.html',
  styleUrls: ['./condicionales.component.css']
})
export class CondicionalesComponent implements OnInit {
  urlGifts: string = '';

  examples: Example[] = [];

  // Propiedades para el modal genérico
  showModal: boolean = false;
  modalTitle: string = '';
  modalComponentType: Type<any> | null = null;
  modalComponentInputs: any = {};

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
    this.http.get<CondicionalesData>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        this.examples = data.condicionales.examples || [];
      },
      error: (error) => {
        console.error('Error loading examples:', error);
      }
    });
  }

  loadBlocklyExercises(): void {
    this.http.get<any>('assets/jsons-base/blockly-exercises.json').subscribe({
      next: (data) => {
        if (data.condicionales && data.condicionales.exercises) {
          this.blocklyExercises = data.condicionales.exercises;
          this.urlGifts = data.condicionales?.rtlGifts || '';
          console.log('Blockly exercises loaded:', this.blocklyExercises.length);
        }
      },
      error: (error) => {
        console.error('Error cargando ejercicios de Blockly:', error);
        this.urlGifts = '';
      }
    });
  }

  // Función para obtener el icono apropiado según el título
  getIconForExample(title: string): string {
    if (title.includes('parque') || title.includes('Carlos')) return '🌳';
    if (title.includes('tienda') || title.includes('Ana')) return '👗';
    if (title.includes('bicicleta') || title.includes('Luis')) return '🚴‍♂️';
    if (title.includes('té') || title.includes('Sofía')) return '🍵';
    if (title.includes('reunión') || title.includes('Pedro')) return '💼';
    if (title.includes('comida') || title.includes('Mariana')) return '🍞';
    if (title.includes('videojuego') || title.includes('Javier')) return '🎮';
    return '🔄'; // Icono por defecto
  }

  // Función para limpiar el título quitando "Ejemplo #:"
  getCleanTitle(title: string): string {
    return title.replace(/^Ejemplo \d+:\s*/, '');
  }

  // Getter para obtener el ejercicio actual de Blockly
  get currentBlocklyExercise(): BlocklyExercise | null {
    return this.blocklyExercises[this.currentBlocklyExerciseIndex] || null;
  }

  // Manejo de ejercicios de Blockly
  onBlocklyExerciseCompleted(event: { exerciseId: string, success: boolean }): void {
    if (event.success) {
      this.completedExercises.add(event.exerciseId);
      console.log('Ejercicio completado:', event.exerciseId);
    }
  }

  nextBlocklyExercise(): void {
    if (this.currentBlocklyExerciseIndex < this.blocklyExercises.length - 1) {
      this.currentBlocklyExerciseIndex++;
    }
  }

  previousBlocklyExercise(): void {
    if (this.currentBlocklyExerciseIndex > 0) {
      this.currentBlocklyExerciseIndex--;
    }
  }

  // Función para abrir el modal del diagrama de flujo
  openFlowchartModal(example: Example): void {
    this.modalTitle = `🔄 Diagrama de Flujo - ${this.getCleanTitle(example.title)}`;
    this.modalComponentType = FlowchartComponent;
    this.modalComponentInputs = {
      steps: example.steps || [],
      title: example.title
    };
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
    this.modalTitle = '';
    this.modalComponentType = null;
    this.modalComponentInputs = {};
  }
}
