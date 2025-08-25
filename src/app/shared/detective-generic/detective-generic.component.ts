import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Caso {
  id: number;
  ambito: string;
  titulo: string;
  introduccion: { tituloCard: string; narrativa: string; objetivo: string };
  etapas: {
    id: string;
    tipo: string;
    tituloCard: string;
    descripcion: string;
    opciones?: { texto: string; resultado: string; avanzaA: string; esCorrecta?: boolean; puntaje: number; esRamaCorrecta?: boolean }[];
    pistasDesbloqueadas?: { cardTipo: string; titulo: string; contenido: string }[];
    solucionCorrecta?: string;
    pasosGuiados?: string[];
    explicacion?: string;
  }[];
  finalExplicacion?: string;
  finalFeedback?: string;
}

@Component({
  selector: 'app-detective-generic',
  templateUrl: './detective-generic.component.html',
  styleUrls: ['./detective-generic.component.css']
})
export class DetectiveGenericComponent implements OnInit {
  opcionesMezcladas: any[] = [];
  @Input() tipo: 1 | 2 = 1; // 1 para ejemplos, 2 para ejercicios
  data: { ejemplos: Caso[]; ejercicios: Caso[] } | null = null;
  casoSeleccionado: Caso | null = null;
  etapaActual: any = null;
  enIntroduccion: boolean = true;
  seleccion: number | null = null; // Índice de la opción seleccionada
  seleccionadas: boolean[] = [];
  seleccionHecha = false;
  mostrarSiguiente = false;
  feedback = '';
  mostrarFeedback = false;
  puntaje = 0;
  pistasDesbloqueadas: any[] = [];
  historial: any[] = [];
  progreso: { completados: number[]; puntaje: number } = { completados: [], puntaje: 0 };
  mostrarModalFinal = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProgreso();
    this.loadData();
  }

  loadData() {
    this.http.get<{ ejemplos: Caso[]; ejercicios: Caso[] }>('assets/jsons-base/detectives-game.json').subscribe({
      next: (data) => {
        this.data = data;
        // No seleccionar ningún caso por defecto
        this.casoSeleccionado = null;
        this.etapaActual = null;
        this.enIntroduccion = true;
      },
      error: (err) => console.error('Error al cargar el JSON:', err)
    });
  }

  loadProgreso() {
    const saved = localStorage.getItem('progreso');
    if (saved) this.progreso = JSON.parse(saved);
  }

  saveProgreso() {
    localStorage.setItem('progreso', JSON.stringify(this.progreso));
  }

  seleccionarCaso(caso: Caso) {
    this.casoSeleccionado = caso;
    this.etapaActual = caso.introduccion;
    this.enIntroduccion = true;
    this.resetEstado();
    this.seleccionadas = [];
    this.actualizarOpcionesMezcladas();
  }

  // Mezcla Fisher-Yates
  mezclarArray(array: any[]): any[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  actualizarOpcionesMezcladas() {
    if (this.etapaActual && this.etapaActual.opciones) {
      this.opcionesMezcladas = this.mezclarArray(this.etapaActual.opciones);
    } else {
      this.opcionesMezcladas = [];
    }
  }

  seleccionarOpcion(opcion: any, index: number) {
    if (!this.seleccionadas.length && this.etapaActual.opciones) {
      this.seleccionadas = this.etapaActual.opciones.map(() => false);
    }
    this.seleccion = index;
    this.feedback = opcion.resultado;
    this.mostrarFeedback = true;
    this.puntaje += opcion.puntaje || 0;
    this.historial.push({
      etapa: this.etapaActual.id,
      opcion: opcion.texto,
      resultado: opcion.resultado,
      puntaje: opcion.puntaje
    });

    if (this.etapaActual.pistasDesbloqueadas) {
      this.pistasDesbloqueadas.push(...this.etapaActual.pistasDesbloqueadas);
    }

    // Marcar la opción como seleccionada
    this.seleccionadas[index] = true;

    // Mostrar el botón Siguiente solo cuando todas las correctas estén seleccionadas (multi) o la correcta (single)
    if (this.tipo === 1) {
      const correctas = this.etapaActual.opciones.filter((o: any) => o.esCorrecta);
      const todasCorrectasSeleccionadas = correctas.every((o: any) => {
        const idx = this.etapaActual.opciones.indexOf(o);
        return this.seleccionadas[idx];
      });
      this.mostrarSiguiente = todasCorrectasSeleccionadas;
      this.seleccionHecha = false;
    } else if (this.tipo === 2) {
      const correctas = this.etapaActual.opciones.filter((o: any) => o.esRamaCorrecta);
      const todasCorrectasSeleccionadas = correctas.every((o: any) => {
        const idx = this.etapaActual.opciones.indexOf(o);
        return this.seleccionadas[idx];
      });
      this.mostrarSiguiente = todasCorrectasSeleccionadas;
      this.seleccionHecha = false;
    }
  }

  submitOpcion() {
    if (this.seleccion !== null) {
      const opcion = this.etapaActual.opciones[this.seleccion];
      this.seleccionarOpcion(opcion, this.seleccion);
    }
  }

  avanzarEtapa() {
    // Si estamos en la introducción, pasar a la primera etapa
    if (this.enIntroduccion && this.casoSeleccionado && this.casoSeleccionado.etapas.length > 0) {
      this.etapaActual = this.casoSeleccionado.etapas[0];
      this.enIntroduccion = false;
      this.resetEstado();
      this.actualizarOpcionesMezcladas();
      return;
    }
  if (!this.etapaActual.opciones) return;
  this.actualizarOpcionesMezcladas();
    const opcionSeleccionada = this.etapaActual.opciones.find((o: any) => (this.tipo === 1 && o.esCorrecta) || (this.tipo === 2 && o.esRamaCorrecta)) || this.etapaActual.opciones[0];
    const nextEtapaId = opcionSeleccionada.avanzaA;

    if (nextEtapaId === 'final') {
      this.etapaActual = {
        id: 'final',
        tipo: 'final',
        tituloCard: 'Caso Resuelto',
        descripcion: this.casoSeleccionado!.finalExplicacion || this.casoSeleccionado!.finalFeedback
      };
      this.progreso.completados.push(this.casoSeleccionado!.id);
      this.progreso.puntaje += this.puntaje;
      this.saveProgreso();
      this.mostrarModalFinal = true;
    } else {
  this.etapaActual = this.casoSeleccionado!.etapas.find(e => e.id === nextEtapaId);
  this.resetEstado();
  this.actualizarOpcionesMezcladas();
    }
  }

  resetEstado() {
    this.seleccion = null;
    this.seleccionadas = [];
    this.seleccionHecha = false;
    this.mostrarSiguiente = false;
    this.mostrarFeedback = false;
    this.feedback = '';
    // Limpiar opciones mezcladas si no hay opciones
    if (!this.etapaActual || !this.etapaActual.opciones) {
      this.opcionesMezcladas = [];
    }
  }

  cerrarModal() {
    this.mostrarModalFinal = false;
    this.seleccionarCaso(this.tipo === 1 ? this.data!.ejemplos[0] : this.data!.ejercicios[0]);
    this.puntaje = 0;
    this.pistasDesbloqueadas = [];
    this.historial = [];
  }
}
