import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-carro-mascotas-game',
  templateUrl: './carro-mascotas-game.component.html',
  styleUrls: ['./carro-mascotas-game.component.css']
})
export class CarroMascotasGameComponent implements OnInit {
  ngOnInit() {
    this.http.get<any>('assets/jsons-base/niveles-carro-mascotas.json').subscribe(data => {
      this.nivelesEjemplo = data.ejemplos;
      this.nivelesEjercicio = data.ejercicios;
      this.cargarNivel(0);
    });
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.moverCarro('up');
    } else if (event.key === 'ArrowDown') {
      this.moverCarro('down');
    } else if (event.key === 'ArrowLeft') {
      this.moverCarro('left');
    } else if (event.key === 'ArrowRight') {
      this.moverCarro('right');
    }
  }
  haGanado(): boolean {
    // Gana si todos los animales han sido recogidos y entregados en su casa
    if (!this.nivelActual) return false;
    return this.nivelActual.animales.every(animal => {
      // Animal recogido y el carro está en la casa del animal y el animal ya no está en el carro
      return this.animalesRecogidos[animal.nombre] &&
        this.posicionCarro.x === animal.casa.x &&
        this.posicionCarro.y === animal.casa.y;
    });
  }
  tieneAnimalesRecogidos(): boolean {
    return Object.values(this.animalesRecogidos).some(v => v);
  }
  @Input() tipoHijo: 1 | 2 = 1;
  nivelActual: any = null;
  nivelesEjemplo: any[] = [];
  nivelesEjercicio: any[] = [];
  indiceNivel: number = 0;
  // Estado del juego
  posicionCarro: { x: number, y: number } | null = null;
  gasolinaRestante: number = 0;
  camino: { x: number, y: number }[] = [];
  animalesRecogidos: { [nombre: string]: boolean } = {};

  constructor(private http: HttpClient) {}

  get niveles() {
    return this.tipoHijo === 1 ? this.nivelesEjemplo : this.nivelesEjercicio;
  }

  // ...existing code...

  cargarNivel(indice: number) {
    this.indiceNivel = indice;
    this.nivelActual = this.niveles[indice];
    // Inicializar estado del juego
    this.posicionCarro = { ...this.nivelActual.carro };
    this.gasolinaRestante = this.nivelActual.gasolina;
    this.camino = [ { ...this.posicionCarro } ];
    this.animalesRecogidos = {};
    for (const animal of this.nivelActual.animales) {
      this.animalesRecogidos[animal.nombre] = false;
    }
  }

  siguienteNivel() {
    if (this.indiceNivel < this.niveles.length - 1) {
      this.cargarNivel(this.indiceNivel + 1);
    }
  }

  anteriorNivel() {
    if (this.indiceNivel > 0) {
      this.cargarNivel(this.indiceNivel - 1);
    }
  }

  getFilas(): number[] {
    return this.nivelActual ? Array(this.nivelActual.size.rows).fill(0).map((_, i) => i) : [];
  }

  getColumnas(): number[] {
    return this.nivelActual ? Array(this.nivelActual.size.cols).fill(0).map((_, i) => i) : [];
  }

  esCarro(x: number, y: number): boolean {
    return this.posicionCarro && this.posicionCarro.x === x && this.posicionCarro.y === y;
  }

  esCamino(x: number, y: number): boolean {
    return this.camino.some(pos => pos.x === x && pos.y === y);
  }

  esAnimal(x: number, y: number): any {
    return this.nivelActual ? this.nivelActual.animales.find(a => a.x === x && a.y === y) : null;
  }

  esCasa(x: number, y: number): any {
    return this.nivelActual ? this.nivelActual.animales.find(a => a.casa.x === x && a.casa.y === y) : null;
  }

  moverCarro(direccion: 'up' | 'down' | 'left' | 'right') {
    if (!this.posicionCarro || this.gasolinaRestante <= 0) return;
    let { x, y } = this.posicionCarro;
    if (direccion === 'up' && y > 0) y--;
    if (direccion === 'down' && y < this.nivelActual.size.rows - 1) y++;
    if (direccion === 'left' && x > 0) x--;
    if (direccion === 'right' && x < this.nivelActual.size.cols - 1) x++;
    // Solo mover si cambia la posición
    if (x !== this.posicionCarro.x || y !== this.posicionCarro.y) {
      this.posicionCarro = { x, y };
      this.gasolinaRestante--;
      this.camino.push({ x, y });
      // Recoger animal si está en la posición
      for (const animal of this.nivelActual.animales) {
        if (animal.x === x && animal.y === y) {
          this.animalesRecogidos[animal.nombre] = true;
        }
      }
    }
  }

  getEmojiAnimal(nombre: string): string {
    const emojis: { [key: string]: string } = {
      'Perro': '🐶',
      'Gato': '🐱',
      'Conejo': '🐰',
      'Tortuga': '🐢',
      'Pájaro': '🐦',
      'Ratón': '🐭',
      'Caballo': '🐴'
    };
    return emojis[nombre] || '🐾';
  }

  getEmojiCarro(): string {
    return '🚙'; // Carro sin fondo
  }
}
