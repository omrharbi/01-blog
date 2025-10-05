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
  constructor(private uploadImage: UploadImage) { }
  previewMode = false;
  content: string = '';
  title: string = '';
  isPreviewMode = true;
  coverImageSrc?: string;
  isSelect: boolean = false;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleRef') titleRef!: ElementRef<HTMLDivElement>;
  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }
  get previewHtml(): string {
    let text_content = this.renderMarkdownWithMedia(this.content);
    // let text = this.getModifiedHtml(text_content)
    // console.log(text, "this.  content");
    return text_content;
  }


//   ngAfterViewInit() {
//   // Test with sample content after view initializes
//   setTimeout(() => {
//     this.testImageProcessing();
//   }, 2000);
// } 
//   async testImageProcessing() {
//     const html = this.renderMarkdownWithMedia(this.content);
//     await this.getModifiedHtml(html);
//   }
  // private async getModifiedHtml(html: string) {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(html, 'text/html');
  //   const images = doc.querySelectorAll('img');

  //   const imageProcessingPromises = Array.from(images).map(async (img, index) => {
  //     const imageUrl = img.src;

  //     try {
  //       const response = await fetch(imageUrl);
  //       const blob = await response.blob();
  //       console.log(blob, `blob for image ${index}`, blob.size);

  //       // Convert blob to File if needed
  //       const file = new File([blob], `image-${index}.jpg`, { type: blob.type });

  //       // Store the file reference
  //       // if (!this.selectedImageFile) {
  //       //   this.selectedImageFile = file;
  //       // }

  //       return file;
  //     } catch (error) {
  //       console.error(`Failed to fetch image ${index}:`, error);
  //       return null;
  //     }
  //   });

  //   const files = await Promise.all(imageProcessingPromises);
  //   console.log('Processed files:', files.filter(file => file !== null));

  //   return files.filter(file => file !== null);
  // }

  onImageSelected(event: Event) {
    this.uploadImage.onImageSelected(event, (imgHTML: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(imgHTML, 'text/html');
      const img = doc.querySelector('img');
      if (img) {
        this.coverImageSrc = img.src;
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
        .replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          '<img src="http://localhost:9090/uploads/$2" class="imageMarkDown" alt="$1" >'
        )
        // Replace image placeholders with actual <img> tags (fallback)
        .replace(
          /\[Image:\s*([^\]]+)\]/g,
          '<img src="http://localhost:9090/uploads/$1" >'
        )
        // Replace video placeholders with actual <video> tags
        .replace(
          /\[Video:\s*([^\]]+)\]/g,
          '<video controls src="http://localhost:9090/uploads/$1" style="max-width:100%;"></video>'
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
    );
  }

  backToEdit() {
    this.previewMode = false;
  }
}
