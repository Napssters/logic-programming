import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';

interface Ejercicio {
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
  selector: 'app-game-question-selection',
  templateUrl: './game-question-selection.component.html',
  styleUrls: ['./game-question-selection.component.css']
})
export class GameQuestionSelectionComponent {

  puntuacionesEjemplos: { [id: number]: number } = {};
  @Input() tipo: number = 2;
  ejemplos: Ejercicio[] = [];
  ejemploSeleccionado: Ejercicio | null = null;
  preguntaActualEjemplo = 0;
  puntuacionEjemplo = 0;
  finalizadoEjemplo = false;
  resultadoEjemplo = '';
  feedbackEjemplo: string = '';
  ejercicios: Ejercicio[] = [];
  loading = true;
  error = '';
  ejercicioSeleccionado: Ejercicio | null = null;
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
        this.ejercicios = data.ejercicios;
        this.ejemplos = data.ejemplos;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el archivo de ejercicios.';
        this.loading = false;
      }
    });
  }

  seleccionarEjercicio(ejercicios: Ejercicio) {
    this.ejercicioSeleccionado = ejercicios;
    this.preguntaActual = 0;
    this.puntuacion = 0;
    this.finalizado = false;
    this.resultado = '';
  }

  seleccionarEjemplo(ejemplo: Ejercicio) {
    this.ejemploSeleccionado = ejemplo;
    this.preguntaActualEjemplo = 0;
    this.puntuacionEjemplo = 0;
    this.finalizadoEjemplo = false;
    this.resultadoEjemplo = '';
    this.feedbackEjemplo = '';
  }

  responderEjemplo(eleccion: string) {
    if (!this.ejemploSeleccionado) return;
    const pregunta = this.ejemploSeleccionado.preguntas[this.preguntaActualEjemplo];
    const consecuencia = pregunta.consecuencias[eleccion];
    let cambio = 0;
    if (pregunta.puntuaciones && typeof pregunta.puntuaciones[eleccion] === 'number') {
      cambio = pregunta.puntuaciones[eleccion];
    } else if (typeof consecuencia?.puntuacion === 'number') {
      cambio = consecuencia.puntuacion;
    }
    this.puntuacionEjemplo += cambio;
    // Feedback por pregunta (solo para ejemplos)
    this.feedbackEjemplo = consecuencia?.feedback || '';
    if (consecuencia?.final) {
      this.finalizadoEjemplo = true;
      this.resultadoEjemplo = '¡Ejemplo finalizado! Puntuación: ' + this.puntuacionEjemplo;
      if (this.ejemploSeleccionado) {
        this.puntuacionesEjemplos[this.ejemploSeleccionado.id] = this.puntuacionEjemplo;
      }
    } else if (consecuencia?.siguiente_ronda) {
      this.preguntaActualEjemplo++;
      if (this.preguntaActualEjemplo >= this.ejemploSeleccionado.preguntas.length) {
        this.finalizadoEjemplo = true;
        this.resultadoEjemplo = '¡Ejemplo finalizado! Puntuación: ' + this.puntuacionEjemplo;
        if (this.ejemploSeleccionado) {
          this.puntuacionesEjemplos[this.ejemploSeleccionado.id] = this.puntuacionEjemplo;
        }
      }
    } else {
      this.preguntaActualEjemplo++;
      if (this.preguntaActualEjemplo >= this.ejemploSeleccionado.preguntas.length) {
        this.finalizadoEjemplo = true;
        this.resultadoEjemplo = '¡Ejemplo finalizado! Puntuación: ' + this.puntuacionEjemplo;
        if (this.ejemploSeleccionado) {
          this.puntuacionesEjemplos[this.ejemploSeleccionado.id] = this.puntuacionEjemplo;
        }
      }
    }
  }

  reiniciarEjemplo() {
    this.ejemploSeleccionado = null;
    this.preguntaActualEjemplo = 0;
    this.puntuacionEjemplo = 0;
    this.finalizadoEjemplo = false;
    this.resultadoEjemplo = '';
    this.feedbackEjemplo = '';
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

  // Devuelve un emoji según el título del ejemplo
  getEmojiEjemplo(titulo: string): string {
    if (titulo.toLowerCase().includes('chef')) return '🍳';
    if (titulo.toLowerCase().includes('ingredientes')) return '🥗';
    if (titulo.toLowerCase().includes('enfermera')) return '💉';
    if (titulo.toLowerCase().includes('pacientes')) return '🏥';
    if (titulo.toLowerCase().includes('tienda')) return '🏪';
    if (titulo.toLowerCase().includes('estilista')) return '💇‍♂️';
    if (titulo.toLowerCase().includes('clientas')) return '💁';
    if (titulo.toLowerCase().includes('organizador')) return '🎉';
    if (titulo.toLowerCase().includes('fiestas')) return '🎊';
    if (titulo.toLowerCase().includes('entrenador')) return '🏋️';
    if (titulo.toLowerCase().includes('deportivo')) return '⚽';
    if (titulo.toLowerCase().includes('técnico')) return '🔧';
    if (titulo.toLowerCase().includes('computadoras')) return '💻';
    return '🧩';
  }

  getMaxScoreForCase(caso: Ejercicio): number {
    let maxScore = 0;
    caso.preguntas.forEach(pregunta => {
      let maxPuntuacion = Math.max(
        ...Object.values(pregunta.consecuencias)
          .map((consecuencia: any) => typeof consecuencia.puntuacion === 'number' ? consecuencia.puntuacion : 0)
      );
      maxScore += maxPuntuacion;
    });
    return maxScore;
  }

}
