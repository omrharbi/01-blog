import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { MarkdownEditor } from '../../../shared/components/markdown-editor/markdown-editor';
import { Preview } from '../../../shared/components/preview/preview';
import { PostRequest } from '../../../core/models/post/postRequest';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { Uploadimages } from '../../../core/service/servicesAPIREST/uploadImages/uploadimages';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';
import { PostResponse, Tags } from '../../../core/models/post/postResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [Materaile, MarkdownModule, MarkdownEditor, Preview],
  templateUrl: './create-post.html',
  styleUrls: ['./create-post.scss'],
})
export class CreatePost {
  constructor(
    private router: Router,
    private preview: PreviewService,
    private sharedServicePost: SharedService,
    private uploadImage: UploadImage,
    private postService: PostService,
    private images: Uploadimages,
    private route: ActivatedRoute,
    private toasterService: ToastrService
  ) { }

  previewMode = false;
  content: string = '';
  submitted = false;
  title: string = '';
  excerpt: string = '';
  isPreviewMode = true;
  coverImageSrc: string = '';
  isSelect: boolean = false;
  selectedFiles: File[] = [];
  newFiles: File[] = [];

  postData: PostResponse = {
    id: "",
    title: '',
    firstImage: "",
    content: '',
    htmlContent: '',
    excerpt: '',
    username: "",
    avatarUser: '',
    medias: [],
    tags: [],
    createdAt: '',
    liked: false,
    likesCount: 0,
    commentCount: 0,
  };

  @Input() post: any;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleRef') titleRef!: ElementRef<HTMLDivElement>;

  newTags: string = '';
  tags: Tags[] = [];
  isEdit: boolean = false;
  showtitle = '';
  canDeactivate(): boolean {
    this.uploadImage.clearFiles();
    return true;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isEdit = params['edit'] === 'true';
    });
    const editData = this.sharedServicePost.getEditPost();
    if (editData) {
      this.postData = { ...editData };
      this.content = this.postData.content || '';
      this.title = this.postData.title || '';
      this.excerpt = this.postData.excerpt || '';
      // if there is already a cover image in the post, mark as selected
      if ((this.postData.firstImage && this.postData.firstImage.trim()) ||
        (this.postData.medias && this.postData.medias.length > 0)) {
        this.isSelect = true;
        this.coverImageSrc = this.postData.firstImage || (this.postData.medias && this.postData.medias[0]?.filePath) || '';
      }
    } else {
      this.clearAll()
    }
  }

  submitPost() {
    this.submitted = true;

    // For create require cover image; for edit allow existing media
    const hasExistingCover = !!(this.postData?.firstImage) || (this.postData?.medias && this.postData.medias.length > 0);
    if (!this.isEdit && !this.isSelect && !hasExistingCover) {
      this.toasterService.warning("Cover image is required");
      return;
    }

    // Validate title
    if (!this.title || !this.title.trim()) {
      this.toasterService.warning("Title is required");
      return;
    }

    // Validate content by stripping HTML (editor may provide html)
    const plain = this.getPlainText(this.content);
    if (!plain) {
      this.toasterService.warning("Content cannot be empty");
      return;
    }

    this.newFiles = this.uploadImage.uploadfiles();
    this.images.saveImages(this.newFiles).subscribe({
      next: (response) => {
        const uploadedMedias: any[] = [];
        if (Array.isArray(response.data)) {
          response.data.forEach((fileResponse, index) => {
            uploadedMedias.push({
              filePath: fileResponse.filePath,
              filename: fileResponse.filename,
              fileType: fileResponse.fileType || this.getFileType(fileResponse.filename),
              fileSize: fileResponse.fileSize || 0,
              displayOrder: index
            });
          });
        }
        this.submitPostData(uploadedMedias);
        this.clearAll()
      },
      error: (error) => {
        const message = error?.message || 'Upload error';
        this.toasterService.error(message);
        console.log('error uploading images', error);
      }
    });

  }
  private clearAll() {
    this.title = ""
    this.excerpt = ""
    this.tags = []
    this.newFiles = []
    this.content = ""
    this.isSelect = false;
    this.coverImageSrc = '';
  }
  private submitPostData(allMedias: any[]) {
    const contentWithoutHTML = this.removeImage(this.content);
    const contenHtml = this.removeSrcImage(this.content);

    const postRequest: PostRequest = {
      title: this.title,
      excerpt: this.excerpt,
      content: contentWithoutHTML,
      htmlContent: contenHtml,
      medias: allMedias,
      tags: this.tags
    };

    if (this.isEdit) {
      this.postService.editPost(postRequest, this.postData.id).subscribe({
        next: (response) => {
          this.sharedServicePost.setNewPost(response.data);
          this.toasterService.success("Edit Post Success");
          this.clearAll()
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.toasterService.error(error?.message || 'Update error');
          console.error('error to update post', error);
        }
      });
    } else {
      this.postService.createPosts(postRequest).subscribe({
        next: (response) => {
          this.toasterService.success("Create Post Success");
          this.sharedServicePost.setNewPost(response.data);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('error to save post', error);
          this.toasterService.error(error?.message || 'Save error');
        }
      });
    }
  }

  addTag() {
    if ((this.newTags.trim() && this.newTags.trim() != null) && this.tags.length < 6) {
      const existTag = this.tags.some(tag => tag.tag === this.newTags.trim());
      if (!existTag) {
        const newTag: Tags = {
          tag: this.newTags.trim()
        };
        this.tags.push(newTag);
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
    const doc = pars.parseFromString(html, 'text/html');
    const imgs = doc.querySelectorAll('img');
    imgs.forEach(img => {
      img.src = '';
    });
    return doc.body.innerHTML;
  }

  private removeImage(html: string): string {
    if (!html) return '';
    html = html.replace(/<img\b[^>]*>/gi, '');
    html = html.replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, '')
    return html;
  }

  private getPlainText(html: string): string {
    if (!html) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent?.trim() || '';
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

  // onVideoSelected()
  cancel() {
    this.clearAll()
    this.uploadImage.clearFiles()
    this.router.navigate(['/'])
  }
  removeCoverImage() {
    this.postData.medias = [];
    this.uploadImage.clearFiles();
    this.isSelect = false;
    this.coverImageSrc = '';
    this.selectedFiles = [];
    if (this.imageInput && this.imageInput.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }
    console.log("remov some this here ");

  }

  onContentChange(newContent: string) {
    this.content = newContent;
    this.postData.content = newContent;
  }

  showPreview() {
    this.previewMode = true;
  }

  isValid(fieldValue: any): boolean {
    return this.submitted && (!fieldValue || fieldValue.trim() === '');
  }

  backToEdit() {
    this.previewMode = false;
  }

  private getFileType(filename: string): string {
    if (!filename) return 'application/octet-stream';
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}