import {
  ChangeDetectorRef,
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
import { PostRequest } from '../../../core/models/postData/postRequest';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { Uploadimages } from '../../../core/service/servicesAPIREST/uploadImages/uploadimages';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';
import { PostResponse, Tags } from '../../../core/models/postData/postResponse';
import { apiUrl } from '../../../core/constant/constante';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [Materaile, MarkdownModule, MarkdownEditor, Preview],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  constructor(private router: Router,
    private preview: PreviewService,
    private sharedServicePost: SharedServicePost,
    private uploadImage: UploadImage, private postService: PostService, private images: Uploadimages, private route: ActivatedRoute) { }
  previewMode = false;
  content: string = '';
  title: string = '';
  excerpt: string = '';
  isPreviewMode = true;
  coverImageSrc: string = "";
  isSelect: boolean = false;
  selectedFiles: File[] = [];
  postData: PostResponse = {
    id: 0,
    title: '',
    content: '',
    htmlContent: '',
    excerpt: '',
    avater_user: '',
    medias: [],
    tags: [],
    createdAt: ''
  };
  @Input() post: any;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleRef') titleRef!: ElementRef<HTMLDivElement>;
  newTags: string = '';
  tags: Tags[] = [];
  isEdit: boolean = false;
  showtitle = ""
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.isEdit = params['edit'] === "true";
    })
    const editData = this.sharedServicePost.getEditPost();
    if (editData) {
      this.postData = { ...editData };
      this.content = this.uploadImage.replaceImage(this.postData.htmlContent ?? "", this.postData);
      if (this.postData.medias && this.postData.medias.length > 0 && this.postData.medias[0].filePath) {
        this.coverImageSrc = apiUrl + this.postData.medias[0].filePath;
        this.isSelect = true;
        console.log("edit data", this.postData);
      } else {
        this.coverImageSrc = '';
      }
    } else {
      this.content = '';
      this.postData.content = '';
    }

  }
  submitPost() {

    let uploadedMedias = this.uploadImage.returnfiles();
    let contentWithoutHTML = this.removeImage(this.content);
    let contenHtml = this.removeSrcImage(this.content);
    this.selectedFiles = this.uploadImage.uploadfiles();


    this.images.saveImages(this.selectedFiles, this.isEdit).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          response.forEach((fileResponse, index) => {
            uploadedMedias[index].filePath = fileResponse.filePath;
            uploadedMedias[index].filename = fileResponse.filename
            // console.log(`File ${index}:`, fileResponse.filename, fileResponse.filePath);
          });
        }

        const postRequest: PostRequest = {
          title: this.title,
          excerpt: this.excerpt,
          content: contentWithoutHTML,
          htmlContent: contenHtml,
          medias: uploadedMedias,
          tags: this.tags
        };
        // console.log(postRequest,"*******************/*******");
        if (this.isEdit) {
          this.postService.editPost(postRequest, this.postData.id).subscribe({
            next: (response) => {
              this.sharedServicePost.setNewPost(response.data)
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error("error to update  post", error);
            }
          })
        } else {
          this.postService.createPosts(postRequest).subscribe({
            next: (response) => {
              this.sharedServicePost.setNewPost(response.data)
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error("error to save post", error);
            }
          })
        }

      },
      error: (error) => {
        console.log("error", error);

      }
    });

  }
  addTag() {
    if (this.newTags.trim() && this.newTags.trim() != null || this.tags.length <= 5) {
      console.log(this.tags.length);
      const existTag = this.tags.some(tag => tag.tag === this.newTags.trim());
      if (!existTag) {
        const newTag: Tags = {
          tag: this.newTags
        }
        this.tags.push(newTag)
        this.newTags = '';

      }

    }
  }
  removeTag(index: number) {
    this.tags.splice(index, 1);
  }


  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }
  get previewHtml(): string {
    let text_content = this.preview.renderMarkdownWithMedia(this.content);
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
  private removeImage(html: string): string {
    if (!html) return "";
    return html.replace(/<img\b[^>]*>/gi, '');
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
    this.postData.medias = []
    this.uploadImage.clearFiles();
    this.isSelect = false;
    this.coverImageSrc = ""
    this.selectedFiles = []
    if (this.imageInput && this.imageInput.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }
  }
  onContentChange(newContent: string) {
    this.content = newContent;
    this.postData.content = newContent;
  }

  showPreview() {
    this.previewMode = true;
  }


  backToEdit() {
    this.previewMode = false;
  }
}
