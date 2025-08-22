import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Ejemplo {
  id: number;
  titulo: string;
  enunciado: string;
  preguntas: Pregunta[];
}

interface Pregunta {
  pregunta: string;
  elecciones: string[];
  consecuencias: { [key: string]: any };
  puntuaciones?: { [key: string]: number };
}

@Component({
  selector: 'app-ejercicios',
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.css']
})
export class EjerciciosComponent {
  ejemplos: Ejemplo[] = [];
  loading = true;
  error = '';
  ejercicioSeleccionado: Ejemplo | null = null;
  preguntaActual = 0;
  puntuacion = 0;
  finalizado = false;
  resultado = '';
  puntuacionesEjercicios: { [id: number]: number } = {};

  constructor(private http: HttpClient) {
    this.cargarEjercicios();
  }

  cargarEjercicios() {
    this.http.get<any>('assets/jsons-base/pensamiento-logico.json').subscribe({
      next: (data) => {
        this.ejemplos = data.ejemplos;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el archivo de ejercicios.';
        this.loading = false;
      }
    });
  }

  seleccionarEjercicio(ejemplo: Ejemplo) {
    this.ejercicioSeleccionado = ejemplo;
    this.preguntaActual = 0;
    this.puntuacion = 0;
    this.finalizado = false;
    this.resultado = '';
  }

  responder(eleccion: string) {
    if (!this.ejercicioSeleccionado) return;
    const pregunta = this.ejercicioSeleccionado.preguntas[this.preguntaActual];
    const consecuencia = pregunta.consecuencias[eleccion];
    // Sumar/restar puntuación según el JSON (si existe)
    let cambio = 0;
    if (pregunta.puntuaciones && typeof pregunta.puntuaciones[eleccion] === 'number') {
      cambio = pregunta.puntuaciones[eleccion];
    } else if (typeof consecuencia?.puntuacion === 'number') {
      cambio = consecuencia.puntuacion;
    }
    this.puntuacion += cambio;
    if (consecuencia?.final) {
      this.finalizado = true;
      this.resultado = '¡Ejercicio finalizado! Puntuación: ' + this.puntuacion;
      if (this.ejercicioSeleccionado) {
        this.puntuacionesEjercicios[this.ejercicioSeleccionado.id] = this.puntuacion;
      }
    } else if (consecuencia?.siguiente_ronda) {
      this.preguntaActual++;
      if (this.preguntaActual >= this.ejercicioSeleccionado.preguntas.length) {
        this.finalizado = true;
        this.resultado = '¡Ejercicio finalizado! Puntuación: ' + this.puntuacion;
        if (this.ejercicioSeleccionado) {
          this.puntuacionesEjercicios[this.ejercicioSeleccionado.id] = this.puntuacion;
        }
      }
    } else {
      this.preguntaActual++;
      if (this.preguntaActual >= this.ejercicioSeleccionado.preguntas.length) {
        this.finalizado = true;
        this.resultado = '¡Ejercicio finalizado! Puntuación: ' + this.puntuacion;
        if (this.ejercicioSeleccionado) {
          this.puntuacionesEjercicios[this.ejercicioSeleccionado.id] = this.puntuacion;
        }
      }
    }
  }

  reiniciar() {
    this.ejercicioSeleccionado = null;
    this.preguntaActual = 0;
    this.puntuacion = 0;
    this.finalizado = false;
    this.resultado = '';
  }

  // Devuelve un emoji según el título del ejercicio
  getEmoji(titulo: string): string {
    if (titulo.toLowerCase().includes('clima')) return '🌦️';
    if (titulo.toLowerCase().includes('desayuno')) return '🍳';
    if (titulo.toLowerCase().includes('semáforo')) return '🚦';
    if (titulo.toLowerCase().includes('detective')) return '🕵️';
    if (titulo.toLowerCase().includes('café')) return '☕';
    if (titulo.toLowerCase().includes('robot')) return '🤖';
    if (titulo.toLowerCase().includes('guardarropa')) return '👔';
    return '🧩';
  }
}
