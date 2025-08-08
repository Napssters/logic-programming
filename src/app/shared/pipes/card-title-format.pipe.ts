import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardTitleFormat'
})
export class CardTitleFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Reemplaza "y" por "/" solo en los títulos específicos
    if (value.trim().toLowerCase() === 'funciones y modularidad') {
      return 'Funciones/Modularidad';
    }
    if (value.trim().toLowerCase() === 'abstracción y simplificacion') {
      return 'Abstracción/Simplificación';
    }
    return value;
  }
}
