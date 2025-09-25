import { Component } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-create-post',
  imports: [Materaile,MarkdownModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  content: string = '';

  insert(syntax: string) {
    this.content += (this.content ? '\n' : '') + syntax;
  }

  save() {
    // هنا تبعث المحتوى Markdown للباك
    console.log('Saving post:', this.content);
  }
}
