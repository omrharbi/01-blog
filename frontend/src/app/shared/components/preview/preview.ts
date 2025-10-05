import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.html',
  styleUrl: './preview.scss',
})
export class Preview {
  @Input() previewHtml!: string;
  @Input() isPreviewMode = false;
  previewMode = true;
  @Input() title!: string;
  @Input() coverImage?: string;
  @Output() exitPreview = new EventEmitter<{ title: string; content: string; }>();
  hasContent(): boolean {
    return this.previewHtml.length > 0 || this.title.length > 0;
  }
  getModifiedHtml(html: string): string {
    if (!this.isPreviewMode) return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const image = doc.querySelectorAll('img')
     image.forEach(img => {
      const div = document.createElement("div");
      div.classList.add("container-image-perview")
      img?.classList.add("image-prview")
      // console.log(image,"images");
      if (img.parentNode) {
        img.parentNode.insertBefore(div, img)
        div.appendChild(img)
      }
    }) 
    return doc.body.innerHTML;
  }
  onExist() {
    this.previewMode = false;
    this.exitPreview.emit({ title: this.title, content: this.previewHtml });
  }
}
