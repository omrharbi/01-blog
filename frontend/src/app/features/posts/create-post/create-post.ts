import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Materaile } from '../../../modules/materaile-module';
import { MarkdownModule } from 'ngx-markdown';
// import { MarkdownEditor } from '../markdown-editor/markdown-editor';
// import { Preview } from '../preview/preview';
import { MediaRequest, PostRequest } from '../../../core/models/postData/postRequest';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { Uploadimages } from '../../../core/service/servicesAPIREST/uploadImages/uploadimages';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';
import { MediaResponse, PostResponse, Tags } from '../../../core/models/postData/postResponse';
import { apiUrl } from '../../../core/constant/constante';
import { MarkdownEditor } from '../../../shared/components/markdown-editor/markdown-editor';
import { Preview } from '../../../shared/components/preview/preview';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [Materaile, MarkdownModule, MarkdownEditor, Preview],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost implements OnInit, OnDestroy {
  @Input() post: any;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  previewMode = false;
  isPreviewMode = true;
  content: string = '';
  title: string = '';
  excerpt: string = '';
  coverImageSrc: string = '';
  isSelect = false;
  submitted = false;
  isEdit = false;

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

  newTags: string = '';
  tags: Tags[] = [];

  constructor(
    private router: Router,
    private preview: PreviewService,
    private sharedServicePost: SharedServicePost,
    private uploadImage: UploadImage,
    private postService: PostService,
    private images: Uploadimages,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isEdit = params['edit'] === 'true';
    });

    const editData = this.sharedServicePost.getEditPost();
    this.initializeData(editData);
  }

  ngOnDestroy(): void {
    this.uploadImage.clearAll();
  }


  private initializeData(editData: PostResponse | null): void {
    this.uploadImage.clearAll();

    if (editData && this.isEdit) {
      this.postData = { ...editData };
      this.title = editData.title || '';
      this.excerpt = editData.excerpt || '';
      this.tags = editData.tags ? [...editData.tags] : [];

      // Load existing media for edit mode
      if (editData.medias && editData.medias.length > 0) {
        this.uploadImage.convertToFile(editData.medias);

        if (editData.medias[0]?.filePath) {
          this.coverImageSrc = apiUrl + editData.medias[0].filePath;
          this.isSelect = true;
        }

        // Replace blob URLs with backend paths for display
        this.content = this.uploadImage.replaceImageSrcs(
          editData.htmlContent || '',
          editData.medias
        );
      } else {
        this.content = editData.htmlContent || '';
      }
    } else {
      this.title = '';
      this.excerpt = '';
      this.content = '';
      this.tags = [];
      this.coverImageSrc = '';
      this.isSelect = false;
    }
  }

  onImageSelected(event: Event): void {
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

  removeCoverImage(): void {
    if (this.imageInput?.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }
    this.uploadImage.clearAll();
    this.isSelect = false;
    this.coverImageSrc = '';
    this.postData.medias = [];
  }


  onContentChange(newContent: string): void {
    this.content = newContent;
    this.postData.content = newContent;

    // Sync: remove images deleted from content
    this.uploadImage.syncImagesWithContent(newContent);
  }
  submitPost(): void {
    this.submitted = true;

    if (!this.isFormValid()) {
      return;
    }

    if (this.isEdit) {
      this.editPost();
    } else {
      this.createPost();
    }
  }

  private createPost(): void {
    // Sync images before submission
    this.uploadImage.syncImagesWithContent(this.content);

    const newFiles = this.uploadImage.getNewFiles();
    const medias = this.uploadImage.getMedias();

    this.images.saveImages(newFiles).subscribe({
      next: (response) => {
        // Update media paths from backend response
        if (Array.isArray(response)) {
          response.forEach((fileResponse, index) => {
            const newFileIndices = Array.from(this.uploadImage.getNewFiles().keys());
            if (index < medias.length) {
              medias[index].filePath = fileResponse.filePath;
              medias[index].filename = fileResponse.filename;
            }
          });
        }

        const cleanContent = this.uploadImage.removeImageTags(this.content);
        const htmlContent = this.uploadImage.clearImageSrcs(this.content);

        const postRequest: PostRequest = {
          title: this.title,
          excerpt: this.excerpt,
          content: cleanContent,
          htmlContent: htmlContent,
          medias: medias,
          tags: this.tags
        };

        // this.postService.createPosts(postRequest).subscribe({
        //   next: (response) => {
        //     this.sharedServicePost.setNewPost(response.data);
        //     this.router.navigate(['/home']);
        //   },
        //   error: (error) => {
        //     console.error('Error creating post:', error);
        //   }
        // });
      },
      error: (error) => {
        console.error('Error uploading images:', error);
      }
    });
  }

  /**
   * Edit existing post
   */
  private editPost(): void {
    // Sync images before submission
    this.uploadImage.syncImagesWithContent(this.content);

    const newFiles = this.uploadImage.getNewFiles();
    const allMedias = this.uploadImage.getMedias();

    // If there are new files, upload them
    if (newFiles.length > 0) {
      this.images.saveImages(newFiles).subscribe({
        next: (response) => {
          this.updatePostWithNewMedias(response, allMedias);
        },
        error: (error) => {
          console.error('Error uploading images:', error);
        }
      });
    } else {
      // No new images, just update post with existing medias
      this.sendEditPostRequest(allMedias);
    }
  }

  /**
   * Update media paths after upload and send edit request
   */
  private updatePostWithNewMedias(uploadResponse: any, allMedias: MediaRequest[]): void {
    if (Array.isArray(uploadResponse)) {
      uploadResponse.forEach((fileResponse, index) => {
        // Find and update the media that corresponds to this upload
        allMedias.forEach(media => {

          if (media.filePath.startsWith('blob:')) {
            media.filePath = fileResponse.filePath;
            media.filename = fileResponse.filename;
          }
        });
      });
    }
    this.sendEditPostRequest(allMedias);
  }
  onTitle(newTitle: string): void {
    this.title = newTitle;
    this.postData.title = newTitle;
  }
  /**
   * Send edit post request to backend
   */
  private sendEditPostRequest(medias: MediaRequest[]): void {
    const cleanContent = this.uploadImage.removeImageTags(this.content);
    const htmlContent = this.uploadImage.clearImageSrcs(this.content);

    const postRequest: PostRequest = {
      title: this.title,
      excerpt: this.excerpt,
      content: cleanContent,
      htmlContent: htmlContent,
      medias: medias,
      tags: this.tags
    };

    this.postService.editPost(postRequest, this.postData.id).subscribe({
      next: (response) => {
        this.sharedServicePost.setNewPost(response.data);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error updating post:', error);
      }
    });
  }

  /**
   * Add tag
   */
  addTag(): void {
    if (this.newTags.trim() && this.tags.length < 5) {
      const existTag = this.tags.some(tag => tag.tag === this.newTags.trim());
      if (!existTag) {
        this.tags.push({ tag: this.newTags.trim() });
        this.newTags = '';
      }
    }
  }

  /**
   * Remove tag
   */
  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  /**
   * Show preview
   */
  showPreview(): void {
    this.previewMode = true;
  }

  /**
   * Back to edit
   */
  backToEdit(): void {
    this.previewMode = false;
  }

  /**
   * Get preview HTML
   */
  get previewHtml(): string {
    return this.preview.renderMarkdownWithMedia(this.content);
  }

  /**
   * Validate form
   */
  isFormValid(): boolean {
    return (
      this.content.trim() !== '' &&
      this.title.trim() !== '' &&
      this.tags.length > 0 &&
      this.coverImageSrc.trim() !== ''
    );
  }

  /**
   * Check if field has error
   */
  isValid(fieldValue: any): boolean {
    return this.submitted && (!fieldValue || fieldValue.trim() === '');
  }

  /**
   * Trigger file input
   */
  triggerFileInput(): void {
    this.imageInput.nativeElement.click();
  }
}