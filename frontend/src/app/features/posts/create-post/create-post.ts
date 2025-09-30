import { Component, Input, input } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { MarkdownEditor } from '../../../shared/components/markdown-editor/markdown-editor';
import { Preview } from '../../../shared/components/preview/preview';

@Component({
  selector: 'app-create-post',
  imports: [Materaile, MarkdownModule, MarkdownEditor, Preview],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  previewMode = false;
  content = '';
  @Input() previewHtml: string = '';
  constructor(private markdownService: MarkdownService) {}
  onContentChange(newContent: string) {
    this.content = newContent;
  }
  showPreview(html: string) {
  this.previewHtml = html;
  this.previewMode = true;
}
  backToEdit() {
    this.previewMode = false;
  }
}
