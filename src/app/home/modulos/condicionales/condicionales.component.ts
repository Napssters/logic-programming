import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Example {
  title: string;
  description: string;
  question: string;
  steps: any[];
}

interface CondicionalesData {
  condicionales: {
    examples: Example[];
  };
}

@Component({
  selector: 'app-condicionales',
  templateUrl: './condicionales.component.html',
  styleUrls: ['./condicionales.component.css']
})
export class CondicionalesComponent implements OnInit {

  examples: Example[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadExamples();
  }

  loadExamples(): void {
    this.http.get<CondicionalesData>('assets/jsons-base/modulos.json').subscribe({
      next: (data) => {
        this.examples = data.condicionales.examples || [];
      },
      error: (error) => {
        console.error('Error loading examples:', error);
      }
    });
  }

  // Función para obtener el icono apropiado según el título
  getIconForExample(title: string): string {
    if (title.includes('parque') || title.includes('Carlos')) return '🌳';
    if (title.includes('tienda') || title.includes('Ana')) return '👗';
    if (title.includes('bicicleta') || title.includes('Luis')) return '🚴‍♂️';
    if (title.includes('té') || title.includes('Sofía')) return '🍵';
    if (title.includes('reunión') || title.includes('Pedro')) return '💼';
    if (title.includes('comida') || title.includes('Mariana')) return '🍞';
    if (title.includes('videojuego') || title.includes('Javier')) return '🎮';
    return '🔄'; // Icono por defecto
  }

  // Función para limpiar el título quitando "Ejemplo #:"
  getCleanTitle(title: string): string {
    return title.replace(/^Ejemplo \d+:\s*/, '');
  }
}
