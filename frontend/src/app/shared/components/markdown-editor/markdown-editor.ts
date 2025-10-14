import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
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

  isUploading = false;
  previewMode = false;

  constructor(private uploadImage: UploadImage) { }
  
  ngAfterViewInit() {
    this.textareaRef.nativeElement.innerHTML = this.content;
  }
  onImageSelected(event: Event) {
    this.uploadImage.onImageSelected(event, (imghtml: string) => {
      const div = this.textareaRef.nativeElement;
      div.innerHTML += imghtml;
      this.onContentChange();
    });
    setTimeout(() => this.onContentChange());;
  }

  // upload() {
  //   this.uploadImage.upload();
  //   // setTimeout(() => this.onContentChange());;
  // }

  // onVideoSelected(event: Event) {
  //   console.log('Video file input changed'); // Debug message
  //   const input = event.target as HTMLInputElement;
  //   const file = input.files?.[0];

  //   if (!file) {
  //     console.log('No video file selected');
  //     return;
  //   }

  //   console.log('Selected video file:', file.name, 'Size:', file.size, 'Type:', file.type);

  //   // Validate file type
  //   if (!file.type.startsWith('video/')) {
  //     console.error('Selected file is not a video');
  //     this.uploadMessage = 'Please select a valid video file';
  //     return;
  //   }

  //   this.selectedVideoFile = file;
  //   this.uploadMessage = `Selected video: ${file.name}`;
  //   this.uploadVideoFile();
  // }

  // uploadImageFile() {
  //   if (!this.selectedImageFile || this.isUploading) return;

  //   this.isUploading = true;
  //   this.uploadMessage = 'Uploading image...';
  //   console.log('Starting image upload...');

  //   // this.uploadService.uploadFile(this.selectedImageFile).subscribe({
  //   //   next: (res) => {
  //   //     console.log('Image upload success:', res);
  //   //     this.uploadMessage = `Image uploaded: ${res.fileName}`;

  //   //     // Insert image placeholder in content
  //   //     const placeholder = `\n![Image](${res.fileName})\n`;
  //   //     this.content += placeholder;
  //   //     console.log('Updated content:', this.content);

  //   //     // Reset
  //   //     this.selectedImageFile = undefined;
  //   //     this.isUploading = false;

  //   //     // Clear the file input
  //   //     if (this.imageInput) {
  //   //       this.imageInput.nativeElement.value = '';
  //   //     }
  //   //   },
  //   //   error: (err) => {
  //   //     console.error('Image upload failed:', err);
  //   //     this.uploadMessage = 'Image upload failed. Check console for details.';
  //   //     this.isUploading = false;
  //   //   },
  //   // });
  // }

  // uploadVideoFile() {
  //   if (!this.selectedVideoFile || this.isUploading) return;

  //   this.isUploading = true;
  //   this.uploadMessage = 'Uploading video...';
  //   console.log('Starting video upload...');

  //   this.uploadService.uploadFile(this.selectedVideoFile).subscribe({
  //     next: (res) => {
  //       console.log('Video upload success:', res);
  //       this.uploadMessage = `Video uploaded: ${res.fileName}`;

  //       // Insert video placeholder in content
  //       const placeholder = `\n[Video: ${res.fileName}]\n`;
  //       this.content += placeholder;
  //       console.log('Updated content:', this.content);

  //       // Reset
  //       this.selectedVideoFile = undefined;
  //       this.isUploading = false;

  //       // Clear the file input
  //       if (this.videoInput) {
  //         this.videoInput.nativeElement.value = '';
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Video upload failed:', err);
  //       this.uploadMessage = 'Video upload failed. Check console for details.';
  //       this.isUploading = false;
  //     },
  //   });
  // }

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
      event.preventDefault();
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
    // console.log("here",this.content);
    this.contentChange.emit(this.content);
  }
}
