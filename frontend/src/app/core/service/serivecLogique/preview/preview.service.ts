import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  private previewHtml = '';
  setPreviewHtml(html: string) {
    this.previewHtml = html;
  }

  getPreviewHtml(): string {
    
    return this.previewHtml;
  }
}
