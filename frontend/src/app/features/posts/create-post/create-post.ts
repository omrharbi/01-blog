import { Component } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownEditor } from '../../../shared/components/markdown-editor/markdown-editor';

@Component({
  selector: 'app-create-post',
  imports: [Materaile,MarkdownModule,MarkdownEditor],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
 
}
