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
  previewMode = true;
  @Input() title!: string;
   @Input() coverImage?: string;
  // previewMode = true;
  @Output() exitPreview = new EventEmitter<{
    title: string;
    content: string;
  }>();
  hasContent(): boolean {
    return this.previewHtml.length > 0 || this.title.length > 0;
  }
  onExist() {
    this.previewMode = false;
    this.exitPreview.emit({ title: this.title, content: this.previewHtml });
    // console.log(this.previewHtml);
  }
}
