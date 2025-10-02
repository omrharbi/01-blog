import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { FileUploadService } from '../../../core/service/file-upload/file-upload.service';
import { PreviewService } from '../../../core/service/preview/preview.service';
import { Router } from '@angular/router';
import { every } from 'rxjs';
@Component({
  selector: 'app-markdown-editor',
  imports: [Materaile],
  templateUrl: './markdown-editor.html',
  styleUrls: ['./markdown-editor.scss'],
})
export class MarkdownEditor {
  @Input() content = 'Start writing your content here...';
  @Input() Titel = '';
  previewHtml: string = '';
  @Output() contentChange = new EventEmitter<string>();
  @Output() TitleChange = new EventEmitter<string>();

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLDivElement>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>;
  selectedImageFile?: File;
  selectedVideoFile?: File;
  uploadMessage = '';
  isUploading = false;
  previewMode = false;

  constructor(private uploadService: FileUploadService) {}
  onInput() {
    const text = this.textareaRef.nativeElement.innerText;
    this.contentChange.emit(text);
  }
  ngAfterViewInit() {
    this.textareaRef.nativeElement.innerHTML = this.content;
  }
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    console.log('Selected image file:', file.name, 'Size:', file.size, 'Type:', file.type);
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      this.uploadMessage = 'Please select a valid image file';
      return;
    }
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      this.selectImage();
    }
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

    // this.uploadService.uploadFile(this.selectedImageFile).subscribe({
    //   next: (res) => {
    //     console.log('Image upload success:', res);
    //     this.uploadMessage = `Image uploaded: ${res.fileName}`;

    //     // Insert image placeholder in content
    //     const placeholder = `\n![Image](${res.fileName})\n`;
    //     this.content += placeholder;
    //     console.log('Updated content:', this.content);

    //     // Reset
    //     this.selectedImageFile = undefined;
    //     this.isUploading = false;

    //     // Clear the file input
    //     if (this.imageInput) {
    //       this.imageInput.nativeElement.value = '';
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Image upload failed:', err);
    //     this.uploadMessage = 'Image upload failed. Check console for details.';
    //     this.isUploading = false;
    //   },
    // });
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

  selectImage(event?: Event) {
    const file = this.selectedImageFile; // assume you set it via input[type=file]

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Insert image HTML into the content
      const imgHTML = `<img src="${reader.result}" class="imageMa">`;

      const div = this.textareaRef.nativeElement;
      div.innerHTML += imgHTML; // append image
      this.onContentChange(); // update content and emit
    };

    reader.readAsDataURL(file); // read file as base64
  }

  selectVideo() {
    console.log('Video button clicked');
    if (this.videoInput) {
      this.videoInput.nativeElement.click();
    } else {
      console.error('Video input element not found');
    }
  }

  applyFormat(prefix: string, suffix: string, placeholder: string, event?: MouseEvent) {
    if (event) {
      event.preventDefault(); // prevent focus/selection loss
      event.stopPropagation();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selectIndex = range.toString() || placeholder;
    const span = document.createElement('span');
    span.innerHTML = `${prefix}${selectIndex}${suffix}`;
    range.deleteContents();
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    this.onContentChange();
  }

  onContentChange() {
    const div = this.textareaRef.nativeElement;
    this.content = div.innerHTML;
    this.contentChange.emit(this.content);
  }
}
