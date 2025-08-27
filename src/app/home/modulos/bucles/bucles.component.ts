import { Component, OnInit, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowchartComponent } from '../../../shared/components/flowchart/flowchart.component';

interface Example {
  title: string;
  description: string;
  question: string;
  steps: any[];
}

@Component({
  selector: 'app-bucles',
  templateUrl: './bucles.component.html',
  styleUrls: ['./bucles.component.css']
})
export class BuclesComponent implements OnInit {

  urlGifts: string = '';

  examples: Example[] = [];
  blocklyExercises: any[] = [];
  currentBlocklyExerciseIndex: number = 0;

  // Control de sección visible (teoría, ejemplos, ejercicios)
  selectedSection: 'teoria' | 'ejemplos' | 'ejercicios' = 'teoria';

  // Variables para el modal
  showModal: boolean = false;
  modalTitle: string = '';
  modalComponentType: Type<any> | null = null;
  modalComponentInputs: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExamples();
    this.loadBlocklyExercises();
  }

  // Cargar ejemplos desde JSON
  loadExamples(): void {
    this.http.get<any>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        this.examples = data.bucles?.examples || [];
      },
      error: (error) => {
        console.error('Error al cargar ejemplos de bucles:', error);
        this.examples = [];
      }
    });
  }

  // Cargar ejercicios de Blockly desde JSON
  loadBlocklyExercises(): void {
    this.http.get<any>('assets/jsons-base/blockly-exercises.json').subscribe({
      next: (data) => {
        this.blocklyExercises = data.bucles?.exercises || [];
        this.urlGifts = data.bucles?.rtlGifts || '';
      },
      error: (error) => {
        console.error('Error al cargar ejercicios de Blockly:', error);
        this.blocklyExercises = [];
        this.urlGifts = '';
      }
    });
  }

  // Obtener ícono según palabras clave del título
  getIconForExample(title: string): string {
    const lowerTitle = title.toLowerCase();

    const iconMap = {
      'ejercicio|flexiones|rutina': '🏃‍♂️',
      'lavado|platos|lavar': '🍽️',
      'contador|numeros|pares': '🔢',
      'estudiante|calificacion|profesor': '📚',
      'ahorro|dinero|ahorrar': '💰',
      'revisión|tareas|correos': '🎲'
    };

    for (const [keywords, icon] of Object.entries(iconMap)) {
      if (keywords.split('|').some(keyword => lowerTitle.includes(keyword))) {
        return icon;
      }
    }

    return '🔄'; // Ícono por defecto
  }

  // Limpiar prefijos del título
  getCleanTitle(title: string): string {
    return title.replace(/^(Ejemplo|Ejercicio):\s*/i, '');
  }

  // Abrir modal con diagrama de flujo
  openFlowchartModal(example: Example): void {
    this.modalTitle = `🔄 Diagrama de Flujo - ${this.getCleanTitle(example.title)}`;
    this.modalComponentType = FlowchartComponent;
    this.modalComponentInputs = {
      steps: example.steps || [],
      title: example.title
    };
    this.showModal = true;
  }

  // Cerrar modal
  closeModal(): void {
    this.showModal = false;
    this.modalComponentType = null;
    this.modalComponentInputs = {};
  }

  // Métodos para ejercicios de Blockly
  onBlocklyExerciseCompleted(result: any): void {
    console.log('Ejercicio completado:', result);
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
}
