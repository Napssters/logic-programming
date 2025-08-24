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
  @Input() tipo: 1 | 2 = 1; // 1 para ejemplos, 2 para ejercicios
  data: { ejemplos: Caso[]; ejercicios: Caso[] } | null = null;
  casoSeleccionado: Caso | null = null;
  etapaActual: any = null;
  seleccion: number | null = null; // Índice de la opción seleccionada
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
        this.seleccionarCaso(this.tipo === 1 ? data.ejemplos[0] : data.ejercicios[0]);
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
    this.resetEstado();
  }

  seleccionarOpcion(opcion: any, index: number) {
    this.seleccion = index;
    this.seleccionHecha = true;
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

    this.mostrarSiguiente = (this.tipo === 1 && opcion.esCorrecta) || (this.tipo === 2 && opcion.esRamaCorrecta);
    if (this.tipo === 2 && !opcion.esRamaCorrecta) {
      this.mostrarSiguiente = false; // Forzar retry en ejercicios
    }
  }

  submitOpcion() {
    if (this.seleccion !== null) {
      const opcion = this.etapaActual.opciones[this.seleccion];
      this.seleccionarOpcion(opcion, this.seleccion);
    }
  }

  avanzarEtapa() {
    if (!this.etapaActual.opciones) return;
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
    }
  }

  resetEstado() {
    this.seleccion = null;
    this.seleccionHecha = false;
    this.mostrarSiguiente = false;
    this.mostrarFeedback = false;
    this.feedback = '';
  }

  cerrarModal() {
    this.mostrarModalFinal = false;
    this.seleccionarCaso(this.tipo === 1 ? this.data!.ejemplos[0] : this.data!.ejercicios[0]);
    this.puntaje = 0;
    this.pistasDesbloqueadas = [];
    this.historial = [];
  }
}
