import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent {
  @Input() n: number = 3; // Tamaño de la matriz nxn
  @Input() description: string = '';
  blocks: string[] = [];
  dropMatrix: (string | null)[][] = [];
  currentIndex: number = 0;
  dragSource: { type: 'block' | 'matrix', row?: number, col?: number, value: string } | null = null;

  ngOnInit() {
    this.dropMatrix = Array.from({ length: this.n }, () => Array(this.n).fill(null));
    this.blocks = Array.from({ length: this.n * this.n }, (_, i) => `Bloque ${i + 1}`);
  }

  onDrop(event: any, row: number, col: number) {
    const block = event.dataTransfer.getData('text');
    // Si el drag viene de la matriz (reorganización)
    if (this.dragSource && this.dragSource.type === 'matrix') {
      const srcRow = this.dragSource.row!;
      const srcCol = this.dragSource.col!;
      // Intercambiar piezas
      const temp = this.dropMatrix[row][col];
      this.dropMatrix[row][col] = this.dropMatrix[srcRow][srcCol];
      this.dropMatrix[srcRow][srcCol] = temp;
    } else {
      // Si el drag viene de los bloques
      if (!this.dropMatrix[row][col]) {
        this.dropMatrix[row][col] = block;
        this.blocks = this.blocks.filter(b => b !== block);
      }
    }
    this.dragSource = null;
  }

  onDragStart(event: any, block: string, row?: number, col?: number) {
    event.dataTransfer.setData('text', block);
    if (row !== undefined && col !== undefined) {
      this.dragSource = { type: 'matrix', row, col, value: block };
    } else {
      this.dragSource = { type: 'block', value: block };
    }
  }

  next() {
    this.currentIndex++;
  }

  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
  }
}
