import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowchartStep } from '../../../shared/interfaces/flowchart.interface';
import { FlowchartComponent } from '../../../shared/components/flowchart/flowchart.component';

interface ModuleCard {
  title: string;
  description: string;
  image: string;
  url: string;
  color: string;
}

interface StartPageData {
  cards: ModuleCard[];
}

interface Example {
  title: string;
  description: string;
  question: string;
  steps: FlowchartStep[];
}

interface IntroduccionData {
  introduccion: {
    examples: Example[];
  };
}

@Component({
  selector: 'app-introduccion',
  templateUrl: './introduccion.component.html',
  styleUrls: ['./introduccion.component.css']
})
export class IntroduccionComponent implements OnInit {
  @ViewChild('flowchartRef') flowchartComponent!: FlowchartComponent;

  moduleCards: ModuleCard[] = [];
  allModules: ModuleCard[] = [];
  currentModuleIndex: number = 0;

  // Nuevas propiedades para los ejemplos
  examples: Example[] = [];
  currentExampleIndex: number = 0;
  currentExample: Example | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadModules();
    this.loadExamples();
  }

  loadModules(): void {
    this.http.get<StartPageData>('assets/jsons-base/start-page.json').subscribe({
      next: (data) => {
        this.allModules = data.cards;
        // Filtrar para excluir la primera tarjeta de "Introducción" para mostrar en la lista
        this.moduleCards = data.cards.filter((card, index) => index !== 0);
        // El índice actual es 0 porque esta es la página de introducción
        this.currentModuleIndex = 0;
        console.log('Modules loaded:', this.allModules.length, 'Current index:', this.currentModuleIndex);
      },
      error: (error) => {
        console.error('Error cargando módulos:', error);
      }
    });
  }

  loadExamples(): void {
    this.http.get<IntroduccionData>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        this.examples = data.introduccion.examples;
        this.currentExample = this.examples[0];
        console.log('Examples loaded:', this.examples.length);
      },
      error: (error) => {
        console.error('Error cargando ejemplos:', error);
      }
    });
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

  // Getter para obtener el título del diagrama
  get flowchartTitle(): string {
    return this.currentExample ? `Diagrama de Flujo: ${this.currentExample.title}` : '';
  }
}
