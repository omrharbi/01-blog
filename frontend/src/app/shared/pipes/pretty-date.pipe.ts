import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'prettyDate',
  pure: true
})
export class PrettyDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US'); 

  transform(
    value: string | Date | number | null | undefined,
    format: string = 'MMM d, y',
    locale?: string
  ): string | null {
    if (!value) return null;

    const pipe = locale ? new DatePipe(locale) : this.datePipe;
    let parsed: string | Date | number = value;
    if (typeof value === 'string') {
      parsed = value.replace(
        /(\.\d{3})\d+/,
        (m) => m.slice(0, 4)
      );
    }

    try {
      return pipe.transform(parsed, format) ?? null;
    } catch {
      return null;
    }
  }
}
