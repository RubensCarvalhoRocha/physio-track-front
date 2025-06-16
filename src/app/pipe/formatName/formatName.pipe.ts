import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatarNome' })
export class FormatarNomePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .split(' ')
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }
}
