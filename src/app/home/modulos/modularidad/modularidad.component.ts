import { Component, OnInit, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowchartComponent } from '../../../shared/components/flowchart/flowchart.component';

interface Example {
  title: string;
  icon?: string;
  description: string;
  question: string;
  steps: any[];
}

@Component({
  selector: 'app-modularidad',
  templateUrl: './modularidad.component.html',
  styleUrls: ['./modularidad.component.css']
})
export class ModularidadComponent implements OnInit {
  urlGifts: string = '';
  ejemplos: Example[] = [];
  ejercicios: any[] = [];
  currentBlocklyExerciseIndex: number = 0;

  // Modal para diagrama de flujo
  showModal: boolean = false;
  modalTitle: string = '';
  modalComponentType: Type<any> | null = null;
  modalComponentInputs: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEjemplos();
    this.cargarEjercicios();
  }

  cargarEjemplos(): void {
    this.http.get<any>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        this.ejemplos = data.funciones?.examples || [];
      },
      error: (err) => {
        this.ejemplos = [];
      }
    });
  }

  cargarEjercicios(): void {
    this.http.get<any>('assets/jsons-base/blockly-exercises.json').subscribe({
      next: (data) => {
        this.ejercicios = data.funciones?.exercises || [];
        this.urlGifts = data.funciones?.rtlGifts || '';
      },
      error: (err) => {
        this.ejercicios = [];
        this.urlGifts = '';
      }
    });
  }

  // Modal para diagrama de flujo
  openFlowchartModal(ejemplo: Example): void {
    this.modalTitle = `🧩 Diagrama de Flujo - ${ejemplo.title}`;
    this.modalComponentType = FlowchartComponent;
    this.modalComponentInputs = {
      steps: ejemplo.steps || [],
      title: ejemplo.title
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalComponentType = null;
    this.modalComponentInputs = {};
  }

  // Métodos para ejercicios de Blockly
  onBlocklyExerciseCompleted(result: any): void {
    // Aquí puedes manejar el resultado del ejercicio
    console.log('Ejercicio completado:', result);
  }

  nextBlocklyExercise(): void {
    if (this.currentBlocklyExerciseIndex < this.ejercicios.length - 1) {
      this.currentBlocklyExerciseIndex++;
    }
  }

  previousBlocklyExercise(): void {
    if (this.currentBlocklyExerciseIndex > 0) {
      this.currentBlocklyExerciseIndex--;
    }
  }
}
