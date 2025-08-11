import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractTipo'
})
export class ExtractTipoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Busca el tipo en el texto
    const match = value.match(/Tipo: Ejemplo de (simplificación|abstracción)\./);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  }
}
