import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  input,
  Output,
  ViewChild,
} from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { MarkdownEditor } from '../../../shared/components/markdown-editor/markdown-editor';
import { Preview } from '../../../shared/components/preview/preview';
import { UploadImage } from '../../../core/service/preview/upload-images/upload-image';

@Component({
  selector: 'app-create-post',
  imports: [Materaile, MarkdownModule, MarkdownEditor, Preview],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  constructor(private uploadImage: UploadImage) {}
  previewMode = false;
  content: string = '';
  title: string = '';
  coverImageSrc?: string; 
  // coverImageSrc: string | null = null;
  isSelect: boolean = false;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleRef') titleRef!: ElementRef<HTMLDivElement>;
  triggerFileInput() {
    this.imageInput.nativeElement.click(); // ✅ call click() on the native input
  }
  get previewHtml(): string {
    console.log(this.content, 'content');
    return this.renderMarkdownWithMedia(this.content);
  }

  onImageSelected(event: Event) {
    this.uploadImage.onImageSelected(event, (imgHTML: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(imgHTML, 'text/html');
      const img = doc.querySelector('img');
      const div = this.titleRef.nativeElement;

      if (img) {
        this.coverImageSrc = img.src; // store the data URL
        this.isSelect = true;
      }
    });
  }
  removeCoverImage() {
    this.isSelect = false;
  }
  onContentChange(newContent: string) {
    this.content = newContent;
  }
  onTitle(newTitle: string) {
    this.title = newTitle;
  }
  showPreview() {
    this.previewMode = true;
  }
  renderMarkdownWithMedia(markdown: string): string {
    return (
      markdown
        // Replace standard markdown image syntax
        // .replace(
        //   /!\[([^\]]*)\]\(([^)]+)\)/g,
        //   '<img src="http://localhost:8080/uploads/$2" class="imageMarkDown" alt="$1" style="max-width:100%;height:auto;">'
        // )
        // // Replace image placeholders with actual <img> tags (fallback)
        // .replace(
        //   /\[Image:\s*([^\]]+)\]/g,
        //   '<img src="http://localhost:8080/uploads/$1" style="max-width:100%;height:auto;">'
        // )
        // Replace video placeholders with actual <video> tags
        .replace(
          /\[Video:\s*([^\]]+)\]/g,
          '<video controls src="http://localhost:8080/uploads/$1" style="max-width:100%;"></video>'
        )
        // Basic markdown formatting
        .replace(/\*\*(.*?)\*\*/g, '<strong class="strongMarkDown">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="EmMarkDown">$1</em>')
        .replace(/~~(.*?)~~/g, '<del class="DelMarkDown">$1</del>')
        .replace(/`(.*?)`/g, '<code class="CodeMarkDown">$1</code>')
        .replace(/^## (.*$)/gim, '<h2 class="H2MarkDown">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="H3MarkDown">$1</h3>')
        .replace(/^\> (.*$)/gim, '<blockquote class="blockquoteMarkDown">$1</blockquote>')
        .replace(/^\- (.*$)/gim, '<li class="LisMarkDown">$1</li>')
        .replace(/\n/g, '<br>')
    );
  }

  backToEdit() {
    this.previewMode = false;
  }
}
