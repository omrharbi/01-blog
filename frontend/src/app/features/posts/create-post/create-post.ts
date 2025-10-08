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
import { PostRequest } from '../../../core/models/postData/postRequest';
import { PostService } from '../../../core/service/create-posts/post-service';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { Router } from '@angular/router';
import { SharedServicePost } from '../../../core/service/shared-service/shared-service-post';

@Component({
  selector: 'app-create-post',
  imports: [Materaile, MarkdownModule, MarkdownEditor, Preview],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  constructor(private router: Router,
    private sharedServicePost:SharedServicePost,
    private uploadImage: UploadImage, private postService: PostService) { }
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
    return text_content;
  }
  onTitle(newTitle: string) {
    this.title = newTitle;
  }
  private removeSrcImage(html: string) {
    const pars = new DOMParser();
    const doc = pars.parseFromString(html, "text/html")
    const imgs = doc.querySelectorAll('img')

    imgs.forEach(img => {
      img.src = ""
    })
    return doc.body.innerHTML;
  }

  submitPost() {
    let result = this.removeSrcImage(this.content);
    const postRequest: PostRequest = {
      title: this.title,
      excerpt: "this is test excerpt",
      htmlContent: result,
      medias: this.uploadImage.upload()
    };
    this.postService.createPosts(postRequest).subscribe({
      next: (response) => {
        this.sharedServicePost.setNewPost(response.data)
        // console.log(this.postCreated, "response post i create it ");
        this.router.navigate(['/home']); 
      },
      error: (error) => {
        console.error("error to save post");
      }
    })
  }


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
