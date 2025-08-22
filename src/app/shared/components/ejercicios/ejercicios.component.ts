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
    if (consecuencia?.final) {
      this.puntuacion++;
      this.finalizado = true;
      this.resultado = '¡Ejercicio finalizado! Puntuación: ' + this.puntuacion;
    } else if (consecuencia?.siguiente_ronda) {
      this.puntuacion++;
      this.preguntaActual++;
      if (this.preguntaActual >= this.ejercicioSeleccionado.preguntas.length) {
        this.finalizado = true;
        this.resultado = '¡Ejercicio finalizado! Puntuación: ' + this.puntuacion;
      }
    } else {
      this.preguntaActual++;
      if (this.preguntaActual >= this.ejercicioSeleccionado.preguntas.length) {
        this.finalizado = true;
        this.resultado = '¡Ejercicio finalizado! Puntuación: ' + this.puntuacion;
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
}
