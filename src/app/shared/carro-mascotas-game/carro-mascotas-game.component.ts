import { Component, OnInit, Input, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// --- Interfaces para la nueva estructura de datos ---
interface Entidad {
  tipo: 'pet' | 'house';
  nombre: string;
  pos: [number, number]; // [row, col]
}

interface Mapa {
  layout: string[][];
  entidades: Entidad[];
}

interface Nivel {
  id: number;
  nombre: string;
  tipo: 'ejemplo' | 'ejercicio';
  mapa: Mapa;
  carro: {
    pos: [number, number];
    gasolina: number;
  };
  rutaOptima?: [number, number][];
}

interface Cell {
  type: 'grass' | 'road';
  orientation: 'horizontal' | 'vertical' | 'intersection' | 'none';
  entity: 'pet' | 'house' | null;
  entityName?: string;
  isOptimal: boolean;
  pos: [number, number];
  optimalDirection?: 'up' | 'down' | 'left' | 'right';
  isStart?: boolean;
  isEnd?: boolean;
}

@Component({
  selector: 'app-carro-mascotas-game',
  templateUrl: './carro-mascotas-game.component.html',
  styleUrls: ['./carro-mascotas-game.component.css']
})
export class CarroMascotasGameComponent implements OnInit {
  // Índice de la casilla óptima actual
  indiceRutaOptimaActual: number = 0;

  @Input() tipoHijo: number = 1; // 1 para ejemplos, 2 para ejercicios

  niveles: Nivel[] = [];
  nivelActual!: Nivel;
  indiceNivel: number = 0;

  // --- Estado del juego ---
  posicionCarro: [number, number] = [0, 0];
  gasolinaRestante: number = 0;
  mascotasRecogidas: string[] = [];
  casasVisitadas: string[] = [];
  mensaje: string | null = null;

  // --- Renderización ---
  flatLayout: Cell[] = [];
  mostrarRuta: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarNiveles();
  }

  // --- Control por Teclado ---
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.mensaje) return; // No hacer nada si hay un mensaje en pantalla

    let dir: 'arriba' | 'abajo' | 'izquierda' | 'derecha' | null = null;
    switch (event.key) {
      case 'ArrowUp':
        dir = 'arriba';
        break;
      case 'ArrowDown':
        dir = 'abajo';
        break;
      case 'ArrowLeft':
        dir = 'izquierda';
        break;
      case 'ArrowRight':
        dir = 'derecha';
        break;
    }

    if (dir) {
      event.preventDefault(); // Prevenir scroll de la página
      this.moverCarro(dir);
    }
  }

  getEntityColor(cell: Cell): string {
    if (!cell.entity) return 'transparent';
    const entidad = this.nivelActual.mapa.entidades.find(e => e.pos[0] === cell.pos[0] && e.pos[1] === cell.pos[1] && e.tipo === cell.entity);
    return entidad && (entidad as any).color ? (entidad as any).color : 'transparent';
  }

  cargarNiveles(): void {
  this.http.get<{ ejemplos: Nivel[], ejercicios: Nivel[] }>('assets/jsons-base/niveles-carro-mascotas.json').subscribe(data => {
      const nivelesSource = this.tipoHijo === 1 ? data.ejemplos : data.ejercicios;
      this.niveles = JSON.parse(JSON.stringify(nivelesSource)); // Deep copy para poder reiniciar
      this.cargarNivel(0);
    });
  }

  cargarNivel(index: number): void {
    if (index < 0 || index >= this.niveles.length) return;

    this.indiceNivel = index;
    this.nivelActual = JSON.parse(JSON.stringify(this.niveles[index])); // Deep copy del nivel para evitar mutaciones
    this.mostrarRuta = false;
    this.reiniciarNivel();
  }

  reiniciarNivel(): void {
    // Usar el estado limpio de nivelActual
    this.posicionCarro = [...this.nivelActual.carro.pos];
    this.gasolinaRestante = this.nivelActual.carro.gasolina;
    this.mascotasRecogidas = [];
    this.casasVisitadas = [];
    this.mensaje = null;
    this.indiceRutaOptimaActual = 0;
    this.generarFlatLayout();
    if (this.mostrarRuta) {
      this.aplicarRutaOptima();
    }
  }

  generarFlatLayout(): void {
    const layout = this.nivelActual.mapa.layout;
    const entidades = this.nivelActual.mapa.entidades;
    this.flatLayout = [];

    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < layout[r].length; c++) {
        const entidadAqui = entidades.find(e => e.pos[0] === r && e.pos[1] === c);
        const cell: Cell = {
          type: layout[r][c] === 'r' ? 'road' : 'grass',
          orientation: this.getRoadOrientation(r, c),
          entity: entidadAqui ? entidadAqui.tipo : null,
          entityName: entidadAqui ? entidadAqui.nombre : undefined,
          isOptimal: false,
          pos: [r, c]
        };
        this.flatLayout.push(cell);
      }
    }
  }

  moverCarro(direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha'): void {
    if (this.mensaje || this.gasolinaRestante <= 0) return;

    let [row, col] = this.posicionCarro;
    const newPos: [number, number] = [row, col];

    if (direccion === 'arriba') newPos[0]--;
    if (direccion === 'abajo') newPos[0]++;
    if (direccion === 'izquierda') newPos[1]--;
    if (direccion === 'derecha') newPos[1]++;

    if (this.esMovimientoValido(newPos)) {
      this.posicionCarro = newPos;
      this.gasolinaRestante--;
      this.verificarInteracciones();
      this.verificarCondicionVictoria();
      // Actualizar la casilla óptima marcada si la ruta está activa
      if (this.mostrarRuta) {
        this.aplicarRutaOptima();
      }
    }
  }

  esMovimientoValido(pos: [number, number]): boolean {
    const [r, c] = pos;
    const layout = this.nivelActual.mapa.layout;
    return r >= 0 && r < layout.length && c >= 0 && c < layout[0].length && layout[r][c] === 'r';
  }

  verificarInteracciones(): void {
    const [r, c] = this.posicionCarro;
    const entidad = this.nivelActual.mapa.entidades.find(e => e.pos[0] === r && e.pos[1] === c);

    if (!entidad) return;

    if (
      entidad.tipo === 'pet' &&
      !this.mascotasRecogidas.includes(entidad.nombre) &&
      !this.casasVisitadas.includes(entidad.nombre)
    ) {
      this.mascotasRecogidas.push(entidad.nombre);
      // Ocultar la mascota del mapa visualmente
      const cellInLayout = this.flatLayout.find(cell => cell.pos[0] === r && cell.pos[1] === c);
      if(cellInLayout) cellInLayout.entity = null;
    }

    if (entidad.tipo === 'house' && this.mascotasRecogidas.includes(entidad.nombre)) {
      // Solo se visita la casa si se tiene la mascota correcta
      if (!this.casasVisitadas.includes(entidad.nombre)) {
        this.casasVisitadas.push(entidad.nombre);
        this.mascotasRecogidas = this.mascotasRecogidas.filter(m => m !== entidad.nombre);
      }
    }
  }

  verificarCondicionVictoria(): void {
    const totalMascotas = this.nivelActual.mapa.entidades.filter(e => e.tipo === 'pet').length;
    const todasEntregadas = this.casasVisitadas.length === totalMascotas;

    if (todasEntregadas) {
      this.mensaje = '¡Felicidades!';
    } else if (this.gasolinaRestante <= 0) {
      this.mensaje = '¡Te quedaste sin gasolina!';
    }
  }

  getGridStyles() {
    if (!this.nivelActual) return {};
    const layout = this.nivelActual.mapa.layout;
    return {
      'grid-template-columns': `repeat(${layout[0].length}, 60px)`,
      'grid-template-rows': `repeat(${layout.length}, 60px)`
    };
  }

  getCarStyles() {
    if (!this.nivelActual) return {};
    return {
      'transform': `translate(${this.posicionCarro[1] * 60}px, ${this.posicionCarro[0] * 60}px)`
    };
  }

  getEmojiAnimal(nombre: string | undefined): string {
    if (nombre === 'Perro') return '🐶';
    if (nombre === 'Gato') return '🐱';
    if (nombre === 'Conejo') return '🐰';
    if (nombre === 'Zorro') return '🦊';
    if (nombre === 'Lobo') return '🐺';
    if (nombre === 'Pato') return '🦆';
    if (nombre === 'Vaca') return '🐮';
    if (nombre === 'Cerdo') return '🐷';
    if (nombre === 'Caballo') return '🐴';
    if (nombre === 'Oveja') return '🐑';
    return '❓';
  }

  getEmojiCarro(): string {
    return this.mascotasRecogidas.length > 0 ? '🚕' : '🚗';
  }

  esEjemplo(): boolean {
    return this.nivelActual?.tipo === 'ejemplo';
  }

  toggleRuta(): void {
    this.mostrarRuta = !this.mostrarRuta;
    // Limpiar la ruta anterior y aplicarla si es necesario
    this.flatLayout.forEach(c => c.isOptimal = false);
    if (this.mostrarRuta) {
      this.aplicarRutaOptima();
    }
  }

  aplicarRutaOptima(): void {
    if (!this.nivelActual.rutaOptima) return;
    this.flatLayout.forEach(c => c.isOptimal = false);
    const ruta = this.nivelActual.rutaOptima;
    let siguienteIndex = this.indiceRutaOptimaActual;
    const carroPos = this.posicionCarro;
    while (siguienteIndex < ruta.length && carroPos[0] === ruta[siguienteIndex][0] && carroPos[1] === ruta[siguienteIndex][1]) {
      siguienteIndex++;
    }
    if (siguienteIndex < ruta.length) {
      const siguiente = ruta[siguienteIndex];
      const cell = this.flatLayout.find(c => c.pos[0] === siguiente[0] && c.pos[1] === siguiente[1]);
      if (cell) cell.isOptimal = true;
      this.indiceRutaOptimaActual = siguienteIndex;
    }
  }

  getRoadOrientation(r: number, c: number): 'horizontal' | 'vertical' | 'intersection' | 'none' {
    if (!this.nivelActual) return 'none';
    const layout = this.nivelActual.mapa.layout;
    if (layout[r][c] !== 'r') return 'none';

    const hasUp = r > 0 && layout[r - 1][c] === 'r';
    const hasDown = r < layout.length - 1 && layout[r + 1][c] === 'r';
    const hasLeft = c > 0 && layout[r][c - 1] === 'r';
    const hasRight = c < layout[0].length - 1 && layout[r][c + 1] === 'r';

    const vertical = hasUp || hasDown;
    const horizontal = hasLeft || hasRight;

    if (vertical && horizontal) return 'intersection';
    if (vertical) return 'vertical';
    if (horizontal) return 'horizontal';
    return 'horizontal';
  }

  siguienteNivel(): void {
  this.mensaje = null;
  this.cargarNivel(this.indiceNivel + 1);
  }

  anteriorNivel(): void {
    this.mensaje = null;
    this.cargarNivel(this.indiceNivel - 1);
  }

  // Devuelve el color de fondo de la casa destino para una mascota
  getColorCasaMascota(nombreMascota: string): string {
    if (!this.nivelActual) return 'transparent';
    // Busca la casa destino de la mascota
    const casa = this.nivelActual.mapa.entidades.find(e => e.tipo === 'house' && e.nombre === nombreMascota);
    // Si la casa tiene color, lo usa, si no, color por defecto
    return casa && (casa as any).color ? (casa as any).color : '#f3ae22'; // color por defecto si no hay color
  }
}
