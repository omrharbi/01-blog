import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { FileUploadService } from '../../../core/service/file-upload/file-upload.service';
import { PreviewService } from '../../../core/service/preview/preview.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-markdown-editor',
  imports: [Materaile],
  templateUrl: './markdown-editor.html',
  styleUrls: ['./markdown-editor.scss'],
})
export class MarkdownEditor {
  @Input() content = 'Start writing your content here...';

  @Output() contentChange = new EventEmitter<string>();
  @Output() previewRequested = new EventEmitter<string>();

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>;
  selectedImageFile?: File;
  selectedVideoFile?: File;
  uploadMessage = '';
  isUploading = false;
  previewMode = false;

  constructor(
    private uploadService: FileUploadService,
    private previewService: PreviewService,
    private router: Router
  ) {}

  onImageSelected(event: Event) {
    console.log('Image file input changed'); // Debug message
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Selected image file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      this.uploadMessage = 'Please select a valid image file';
      return;
    }

    this.selectedImageFile = file;
    this.uploadMessage = `Selected image: ${file.name}`;
    this.uploadImageFile();
  }

  onVideoSelected(event: Event) {
    console.log('Video file input changed'); // Debug message
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      console.log('No video file selected');
      return;
    }

    console.log('Selected video file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    if (!file.type.startsWith('video/')) {
      console.error('Selected file is not a video');
      this.uploadMessage = 'Please select a valid video file';
      return;
    }

    this.selectedVideoFile = file;
    this.uploadMessage = `Selected video: ${file.name}`;
    this.uploadVideoFile();
  }

  uploadImageFile() {
    if (!this.selectedImageFile || this.isUploading) return;

    this.isUploading = true;
    this.uploadMessage = 'Uploading image...';
    console.log('Starting image upload...');

    this.uploadService.uploadFile(this.selectedImageFile).subscribe({
      next: (res) => {
        console.log('Image upload success:', res);
        this.uploadMessage = `Image uploaded: ${res.fileName}`;

        // Insert image placeholder in content
        const placeholder = `\n![Image](${res.fileName})\n`;
        this.content += placeholder;
        console.log('Updated content:', this.content);

        // Reset
        this.selectedImageFile = undefined;
        this.isUploading = false;

        // Clear the file input
        if (this.imageInput) {
          this.imageInput.nativeElement.value = '';
        }
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        this.uploadMessage = 'Image upload failed. Check console for details.';
        this.isUploading = false;
      },
    });
  }

  uploadVideoFile() {
    if (!this.selectedVideoFile || this.isUploading) return;

    this.isUploading = true;
    this.uploadMessage = 'Uploading video...';
    console.log('Starting video upload...');

    this.uploadService.uploadFile(this.selectedVideoFile).subscribe({
      next: (res) => {
        console.log('Video upload success:', res);
        this.uploadMessage = `Video uploaded: ${res.fileName}`;

        // Insert video placeholder in content
        const placeholder = `\n[Video: ${res.fileName}]\n`;
        this.content += placeholder;
        console.log('Updated content:', this.content);

        // Reset
        this.selectedVideoFile = undefined;
        this.isUploading = false;

        // Clear the file input
        if (this.videoInput) {
          this.videoInput.nativeElement.value = '';
        }
      },
      error: (err) => {
        console.error('Video upload failed:', err);
        this.uploadMessage = 'Video upload failed. Check console for details.';
        this.isUploading = false;
      },
    });
  }

  selectImage() {
    if (this.imageInput) {
      this.imageInput.nativeElement.click();
    } else {
      console.error('Image input element not found');
    }
  }

  // Trigger video file selection
  selectVideo() {
    console.log('Video button clicked');
    if (this.videoInput) {
      this.videoInput.nativeElement.click();
    } else {
      console.error('Video input element not found');
    }
  }

  renderMarkdownWithMedia(markdown: string): string {
    return (
      markdown
        // Replace standard markdown image syntax
        .replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          '<img src="http://localhost:8080/uploads/$2" alt="$1" style="max-width:100%;height:auto;">'
        )
        // Replace image placeholders with actual <img> tags (fallback)
        .replace(
          /\[Image:\s*([^\]]+)\]/g,
          '<img src="http://localhost:8080/uploads/$1" style="max-width:100%;height:auto;">'
        )
        // Replace video placeholders with actual <video> tags
        .replace(
          /\[Video:\s*([^\]]+)\]/g,
          '<video controls src="http://localhost:8080/uploads/$1" style="max-width:100%;"></video>'
        )
        // Basic markdown formatting
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\n/g, '<br>')
    );
  }

  openFullPreview() {
    const html = this.renderMarkdownWithMedia(this.content);
    this.previewRequested.emit(html); 
   }

  applyFormat(prefix: string, suffix: string, placeholder: string) {
    const textarea = this.textareaRef.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.content.substring(start, end);

    const newText =
      this.content.substring(0, start) +
      prefix +
      (selectedText || placeholder) +
      suffix +
      this.content.substring(end);

    this.content = newText;

    setTimeout(() => {
      textarea.focus();
      const newPos = start + prefix.length + (selectedText || placeholder).length;
      textarea.setSelectionRange(newPos, newPos);
    });
  }
  get previewHtml(): string {
    return this.renderMarkdownWithMedia(this.content);
  }
  // onContentInput(newValue: string) {
  //   this.content = newValue;
  //   this.contentChange.emit(this.content);
  // }
  showPreview() {
    this.previewRequested.emit(); // tell parent to switch to preview
  }
}
