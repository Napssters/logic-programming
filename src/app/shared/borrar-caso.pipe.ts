import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'borrarCaso'
})
export class BorrarCasoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
  // Elimina exactamente 'Caso del' (mayúsculas/minúsculas, con o sin espacios antes/después) en cualquier parte del string
  return value.replace(/\b[Cc]aso del\b/g, '').replace(/\s{2,}/g, ' ').trim();
  }
}
