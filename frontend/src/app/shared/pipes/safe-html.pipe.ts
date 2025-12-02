import { Pipe, PipeTransform } from '@angular/core';
import DOMPurify from 'dompurify';

@Pipe({
    name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
    transform(value: string): string {
        return DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });
    }
}
