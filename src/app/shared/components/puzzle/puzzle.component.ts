import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent {
  showSteps: boolean = false;
  @Input() n: number = 3;
  @Input() description: string = '';
  @Input() blocks: { id: number, text: string }[] = [];
  @Input() currentExample: any;
  @Input() currentExampleIndex: number = 0;
  @Input() examples: any[] = [];
  @Input() validationResult: string = '';
  @Output() previousExample = new EventEmitter<void>();
  @Output() nextExample = new EventEmitter<void>();
  stepIndex: number = 0;

  get currentStep(): any {
    if (this.currentExample?.explanation && this.currentExample.explanation.length > 0) {
      return this.currentExample.explanation[this.stepIndex];
    }
    return null;
  }

  get canGoPreviousStep(): boolean {
    return this.stepIndex > 0;
  }

  get canGoNextStep(): boolean {
    return this.currentExample?.explanation && this.stepIndex < this.currentExample.explanation.length - 1;
  }

  previousStep() {
    if (this.canGoPreviousStep) {
      this.stepIndex--;
    }
  }

  nextStep() {
    if (this.canGoNextStep) {
      this.stepIndex++;
      // Mover el bloque correspondiente al paso actual en la matriz y eliminarlo del drag
      if (
        this.currentExample?.explanation &&
        this.currentExample?.answer &&
        Array.isArray(this.currentExample.answer) &&
        this.currentExample.explanation[this.stepIndex]?.blockId_answer !== undefined
      ) {
        const blockId = this.currentExample.explanation[this.stepIndex].blockId_answer;
        const answerBlock = this.currentExample.answer.find((a: any) => a.blockId === blockId);
        const block = this.blocks.find(b => b.id === blockId);
        console.log('Paso', this.stepIndex + 1, 'BlockId:', blockId, 'Bloque:', block || answerBlock);
        if (block) {
          // Calcular posición destino en la matriz
          const row = Math.floor(this.stepIndex / this.n);
          const col = this.stepIndex % this.n;
          this.dropMatrix[row][col] = block;
          this.blocks = this.blocks.filter(b => b.id !== blockId);
          this.blocks = [...this.blocks];
          console.log('Paso movido:', block);
          console.log('Estado matriz:', this.dropMatrix);
        }
      }
    }
  }

  ngOnChanges() {
    this.stepIndex = 0;
  }
  @Output() validatePuzzle = new EventEmitter<void>();
  @Output() blocksChange = new EventEmitter<any[]>();
  dropMatrix: ({ id: number, text: string } | null)[][] = [];
  dragSource: { type: 'block' | 'matrix', row?: number, col?: number, value: string } | null = null;

  ngOnInit() {
    // Determinar tamaño dinámico de la matriz según el answer del ejercicio
    let answerLength = this.currentExample?.answer?.length || 9;
    let dynamicN = Math.sqrt(answerLength);
    if (Number.isInteger(dynamicN) && dynamicN > 1) {
      this.n = dynamicN;
    } else {
      this.n = 3;
    }
    this.dropMatrix = Array.from({ length: this.n }, () => Array(this.n).fill(null));
    // Solo copiar los bloques si NO estamos en ejemplos (es decir, si blocks es undefined o null)
    if (!this.examples || this.examples.length === 0) {
      if (this.blocks && this.blocks.length > 0) {
        this.blocks = [...this.blocks];
      } else {
        this.blocks = Array.from({ length: this.n * this.n }, (_, i) => ({ id: i + 1, text: `Bloque ${i + 1}` }));
      }
    }
    // Si estamos en ejemplos, blocks ya es reactivo y no se debe copiar
  }

  onDrop(event: any, row: number, col: number) {
    const blockText = event.dataTransfer.getData('text');
    // Si el drag viene de la matriz (reorganización)
    if (this.dragSource && this.dragSource.type === 'matrix') {
      const srcRow = this.dragSource.row!;
      const srcCol = this.dragSource.col!;
      // Intercambiar piezas
      const temp = this.dropMatrix[row][col];
      this.dropMatrix[row][col] = this.dropMatrix[srcRow][srcCol];
      this.dropMatrix[srcRow][srcCol] = temp;
    } else if (this.dragSource && this.dragSource.type === 'block') {
      // Si el drag viene de los bloques
      const blockObj = this.blocks.find(b => b.text === blockText);
      if (blockObj) {
        if (!this.dropMatrix[row][col]) {
          // Si el espacio está vacío, poner el bloque
          this.dropMatrix[row][col] = blockObj;
          this.blocks = this.blocks.filter(b => b.text !== blockText);
        } else {
          // Si el espacio está ocupado, intercambiar
          const temp = this.dropMatrix[row][col];
          this.dropMatrix[row][col] = blockObj;
          this.blocks = this.blocks.filter(b => b.text !== blockText);
          this.blocks.push(temp!);
        }
      }
    }
    this.dragSource = null;
  }

  onDropToDrag(event: any) {
    const blockText = event.dataTransfer.getData('text');
    // Buscar el bloque en la matriz y devolverlo al drag
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const cell = this.dropMatrix[i][j];
        if (cell && cell.text === blockText) {
          this.blocks.push(cell);
          this.dropMatrix[i][j] = null;
          // Emitir el array actualizado de bloques
          this.blocksChange.emit(this.blocks);
          break;
        }
      }
    }
    this.dragSource = null;
  }

  onDragStart(event: any, block: { id: number, text: string }, row?: number, col?: number) {
    event.dataTransfer.setData('text', block.text);
    if (row !== undefined && col !== undefined) {
      this.dragSource = { type: 'matrix', row, col, value: block.text };
    } else {
      this.dragSource = { type: 'block', value: block.text };
    }
  }

  onPreviousExercise() {
  this.showSteps = false;
  this.stepIndex = 0;
  this.previousExample.emit();
  }

  onNextExercise() {
  this.showSteps = false;
  this.stepIndex = 0;
  this.nextExample.emit();
  }

  onValidatePuzzle() {
    this.validatePuzzle.emit();
  }

  get canGoPrevious(): boolean {
    return this.currentExampleIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentExampleIndex < this.examples.length - 1;
  }
  get currentTitle(): string {
    return this.currentExample?.title || '';
  }
  get currentDescription(): string {
    return this.currentExample?.description || '';
  }
  get currentInstructions(): string {
    return this.currentExample?.instructions || '';
  }
  get currentDifficulty(): string {
    return this.currentExample?.difficulty || 'easy';
  }
  getDifficultyColor(difficulty: string): string {
    if (difficulty === 'easy') return '#4ade80';
    if (difficulty === 'medium') return '#fbbf24';
    if (difficulty === 'hard') return '#ef4444';
    return '#a3a3a3';
  }
  getDifficultyBorderColor(difficulty: string): string {
    if (difficulty === 'easy') return '#22c55e';
    if (difficulty === 'medium') return '#d97706';
    if (difficulty === 'hard') return '#b91c1c';
    return '#737373';
  }
  getDifficultyText(difficulty: string): string {
    if (difficulty === 'easy') return 'Fácil';
    if (difficulty === 'medium') return 'Intermedio';
    if (difficulty === 'hard') return 'Difícil';
    return 'Desconocido';
  }
  setShowSteps(value: boolean) {
    console.log('setShowSteps llamado:', value);
    this.showSteps = value;
    if (value) {
      this.stepIndex = 0;
      if (
        this.currentExample?.answer &&
        Array.isArray(this.currentExample.answer) &&
        this.currentExample.answer.length > 0
      ) {
        console.log('currentExample.answer:', this.currentExample.answer);
        const firstAnswer = this.currentExample.answer[0];
        const blockId = firstAnswer.blockId !== undefined ? firstAnswer.blockId : firstAnswer;
        const block = this.blocks.find(b => b.id === blockId);
        console.log('Primer paso blockId:', blockId, 'Bloque encontrado:', block);
        if (block) {
          const row = Math.floor(0 / this.n);
          const col = 0 % this.n;
          this.dropMatrix[row][col] = block;
          this.blocks = this.blocks.filter(b => b.id !== blockId);
          this.blocks = [...this.blocks];
          console.log('Primer paso movido:', block);
          console.log('Estado matriz:', this.dropMatrix);
        }
      }
    }
  }
}
