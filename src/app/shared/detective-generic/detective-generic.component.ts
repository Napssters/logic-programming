import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
    pistasDesbloqueadas: { cardTipo: string; titulo: string; contenido: string }[];
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
  @Input() tipo: 1 | 2 = 1;
  caso: Caso | null = null;
  etapaActual: any = null;
  seleccion: number | null = null; // Nueva propiedad para la selección del usuario
  seleccionHecha = false;
  mostrarSiguiente = false;
  feedback = '';
  mostrarFeedback = false;
  puntaje = 0;
  progreso: { completados: number[]; puntaje: number } = { completados: [], puntaje: 0 };

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadProgreso();
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.loadCaso(id);
    });
  }

  loadCaso(id: number) {
    this.http.get<{ ejemplos: Caso[]; ejercicios: Caso[] }>('assets/jsons-base/detectives-game.json').subscribe(data => {
      this.caso = this.tipo === 1 ? data.ejemplos.find(c => c.id === id)! : data.ejercicios.find(c => c.id === id)!;
      this.etapaActual = this.caso.introduccion;
      this.resetSeleccion(); // Resetear selección al cargar un caso
    });
  }

  loadProgreso() {
    const saved = localStorage.getItem('progreso');
    if (saved) this.progreso = JSON.parse(saved);
  }

  saveProgreso() {
    localStorage.setItem('progreso', JSON.stringify(this.progreso));
  }

  seleccionarOpcion(opcion: any) {
    this.seleccionHecha = true;
    this.mostrarSiguiente = opcion.esCorrecta || this.tipo === 1;
    this.puntaje += opcion.puntaje;
    this.feedback = opcion.resultado;
    this.mostrarFeedback = true;
    if (this.tipo === 2 && !opcion.esRamaCorrecta) {
      this.mostrarSiguiente = false; // Forzar retry en ejercicios si no es rama correcta
    }
  }

  avanzarEtapa() {
    const nextEtapaId = this.etapaActual.opciones?.find((o: any) => o.esCorrecta)?.avanzaA || this.etapaActual.opciones?.[0].avanzaA;
    if (nextEtapaId === 'final') {
      this.etapaActual = { id: 'final', tipo: 'final', tituloCard: 'Caso Resuelto', descripcion: this.caso!.finalExplicacion || this.caso!.finalFeedback };
      this.progreso.completados.push(this.caso!.id);
      this.progreso.puntaje += this.puntaje;
      this.saveProgreso();
    } else {
      this.etapaActual = this.caso!.etapas.find(e => e.id === nextEtapaId);
      this.resetSeleccion(); // Resetear selección al avanzar
    }
  }

  submitOpcion(seleccion: number | null) {
    if (seleccion !== null) {
      const opcion = this.etapaActual.opciones[seleccion];
      this.seleccionarOpcion(opcion);
      if (opcion.esRamaCorrecta || opcion.esCorrecta) {
        this.mostrarSiguiente = true;
      }
    }
  }

  resetSeleccion() {
    this.seleccion = null;
    this.seleccionHecha = false;
    this.mostrarSiguiente = false;
    this.mostrarFeedback = false;
    this.feedback = '';
  }
}
