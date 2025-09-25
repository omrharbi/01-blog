import { Component, ElementRef, ViewChild } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-markdown-editor',
  imports: [Materaile, MarkdownModule],
  templateUrl: './markdown-editor.html',
  styleUrl: './markdown-editor.scss',
})
export class MarkdownEditor {
  content: string = '';
  @ViewChild('editor') editor!: ElementRef<HTMLTextAreaElement>;

  // insert(syntax: string) {
  //   this.content += (this.content ? '\n' : '') + syntax;
  // }

  // save() {
  //   console.log('Saving post:', this.content);
  // }

  applyFormat(before: string, after: string, defaultText: string = '') {
    const textarea = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.content.substring(start, end);

    const insertText = selected || defaultText;

    // Update component content
    this.content =
      this.content.substring(0, start) + before + insertText + after + this.content.substring(end);

    // Restore cursor position
    setTimeout(() => {
      const cursorPos = start + before.length + insertText.length + after.length;
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
      textarea.focus();
    }, 0);
  }
}
