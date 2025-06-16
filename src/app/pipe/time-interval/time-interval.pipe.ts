import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeInterval',
})
export class TimeIntervalPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) {
      return '';
    }

    const years = value.years > 0 ? `${value.years} ano${value.years > 1 ? 's' : ''}` : '';
    const months = value.months > 0 ? `${value.months} mês${value.months > 1 ? 'es' : ''}` : '';
    const days = value.days > 0 ? `${value.days} dia${value.days > 1 ? 's' : ''}` : '';
    const hours = value.hours > 0 ? (value.hours < 10 ? `0${value.hours}:` : `${value.hours}:`) : '00:';
    const minutes = value.minutes > 0 ? (value.minutes < 10 ? `0${value.minutes}:` : `${value.minutes}:`) : '00:';
    const seconds = value.wholeSeconds > 0 ? (value.wholeSeconds < 10 ? `0${value.wholeSeconds}` : `${value.wholeSeconds}`) : '00';

    const a = `${hours}${minutes}${seconds}`

    const parts = [years, months, days, a].filter((part) => part);

    return parts.join(' ') || '0 segundos';
  }
}
