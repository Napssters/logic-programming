import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PuzzleComponent } from '../../../shared/components/puzzle/puzzle.component';

@Component({
  selector: 'app-abstraccion',
  templateUrl: './abstraccion.component.html',
  styleUrls: ['./abstraccion.component.css']
})
export class AbstraccionComponent implements OnInit {
  blocklyExercises: any[] = [];
  currentBlocklyIndex: number = 0;
  currentBlockly: any = null;
  @ViewChild('puzzleRef') puzzleComponent!: PuzzleComponent;

  selectedSection: number = 1;

  examples: any[] = [];
  currentExampleIndex: number = 0;
  currentExample: any = null;
  validationResult: string = '';

  // Para sección 3: navegación y validación de ejercicios de abstracción
  get canGoPreviousPuzzle(): boolean {
    return this.currentBlocklyIndex > 0;
  }
  get canGoNextPuzzle(): boolean {
    return this.currentBlocklyIndex < this.blocklyExercises.length - 1;
  }
  previousPuzzle(): void {
    if (this.currentBlocklyIndex > 0) {
      this.currentBlocklyIndex--;
      this.currentBlockly = this.blocklyExercises[this.currentBlocklyIndex];
      this.resetPuzzle();
      this.validationResult = '';
    }
  }
  nextPuzzle(): void {
    if (this.currentBlocklyIndex < this.blocklyExercises.length - 1) {
      this.currentBlocklyIndex++;
      this.currentBlockly = this.blocklyExercises[this.currentBlocklyIndex];
      this.resetPuzzle();
      this.validationResult = '';
    }
  }
  get puzzleBlocks(): any[] {
    return this.currentBlockly?.blocks || [];
  }
  get puzzleAnswer(): any[] {
    return this.currentBlockly?.answer || [];
  }
  validatePuzzle(): void {
    if (!this.puzzleComponent) return;
    const userBlocks = this.puzzleComponent.dropMatrix.flat().filter(b => b !== null).map(b => (b as any).text);
    const answerBlocks = this.puzzleAnswer.map(a => a.text);
    const isCorrect = userBlocks.length === answerBlocks.length && userBlocks.every((b, i) => b === answerBlocks[i]);
    this.validationResult = isCorrect ? '¡Correcto!' : 'Incorrecto, revisa el orden y los bloques.';
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExamples();
  this.loadBlocklyExercises();
  }
  loadBlocklyExercises(): void {
    this.http.get<any>('assets/jsons-base/blockly-exercises.json').subscribe({
      next: (data) => {
        const modulo = data['abstraccion'];
        this.blocklyExercises = modulo.exercises || [];
        this.currentBlockly = this.blocklyExercises[0] || null;
        this.currentBlocklyIndex = 0;
        console.log('Blockly Abstracción loaded:', this.blocklyExercises.length);
      },
      error: (error) => {
        console.error('Error cargando ejercicios blockly:', error);
      }
    });
  }
  previousBlockly(): void {
    if (this.currentBlocklyIndex > 0) {
      this.currentBlocklyIndex--;
      this.currentBlockly = this.blocklyExercises[this.currentBlocklyIndex];
      this.resetPuzzle();
      this.validationResult = '';
    }
  }

  nextBlockly(): void {
    if (this.currentBlocklyIndex < this.blocklyExercises.length - 1) {
      this.currentBlocklyIndex++;
      this.currentBlockly = this.blocklyExercises[this.currentBlocklyIndex];
      this.resetPuzzle();
      this.validationResult = '';
    }
  }

  get canGoPreviousBlockly(): boolean {
    return this.currentBlocklyIndex > 0;
  }

  get canGoNextBlockly(): boolean {
    return this.currentBlocklyIndex < this.blocklyExercises.length - 1;
  }

  get blocklyBlocks(): any[] {
    return this.currentBlockly?.blocks || [];
  }

  get blocklyAnswer(): any[] {
    return this.currentBlockly?.answer || [];
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
    if (!this.currentExample?.blocks) return [];
    // Mezclar los bloques aleatoriamente cada vez que se accede
    const blocks = [...this.currentExample.blocks];
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    return blocks;
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

  // ...existing code...
}
