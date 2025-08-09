import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PuzzleComponent } from '../../../shared/components/puzzle/puzzle.component';

@Component({
  selector: 'app-abstraccion',
  templateUrl: './abstraccion.component.html',
  styleUrls: ['./abstraccion.component.css']
})
export class AbstraccionComponent implements OnInit {
  @ViewChild('puzzleRef') puzzleComponent!: PuzzleComponent;

  selectedSection: number = 1;

  examples: any[] = [];
  currentExampleIndex: number = 0;
  currentExample: any = null;
  validationResult: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExamples();
  }

  loadExamples(): void {
    this.http.get<any>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        // Adaptar para el nombre de módulo correcto
        const modulo = data['abstraccion'];
        this.examples = modulo.examples;
        this.currentExample = this.examples[0];
        console.log('Abstracción examples loaded:', this.examples.length);
      },
      error: (error) => {
        console.error('Error cargando ejemplos de abstracción:', error);
      }
    });
  }

  previousExample(): void {
    if (this.currentExampleIndex > 0) {
      this.currentExampleIndex--;
      this.currentExample = this.examples[this.currentExampleIndex];
      this.resetPuzzle();
      this.validationResult = '';
    }
  }

  nextExample(): void {
    if (this.currentExampleIndex < this.examples.length - 1) {
      this.currentExampleIndex++;
      this.currentExample = this.examples[this.currentExampleIndex];
      this.resetPuzzle();
      this.validationResult = '';
    }
  }

  get canGoPreviousExample(): boolean {
    return this.currentExampleIndex > 0;
  }

  get canGoNextExample(): boolean {
    return this.currentExampleIndex < this.examples.length - 1;
  }

  get currentBlocks(): any[] {
    return this.currentExample?.blocks || [];
  }

  get currentAnswer(): any[] {
    return this.currentExample?.answer || [];
  }

  resetPuzzle(): void {
    setTimeout(() => {
      if (this.puzzleComponent) {
        this.puzzleComponent.ngOnInit();
      }
    }, 0);
  }

  validatePuzzle(): void {
  if (!this.puzzleComponent) return;
  // Obtener el estado actual del dropMatrix
  const userBlocks = this.puzzleComponent.dropMatrix.flat().filter(b => b !== null).map(b => (b as any).text);
  const answerBlocks = this.currentAnswer.map(a => a.text);
  const isCorrect = userBlocks.length === answerBlocks.length && userBlocks.every((b, i) => b === answerBlocks[i]);
  this.validationResult = isCorrect ? '¡Correcto!' : 'Incorrecto, revisa el orden y los bloques.';
  }
}
