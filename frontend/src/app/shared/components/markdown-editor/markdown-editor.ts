import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';

@Component({
  selector: 'app-markdown-editor',
  imports: [Materaile],
  templateUrl: './markdown-editor.html',
  styleUrls: ['./markdown-editor.scss'],
})
export class MarkdownEditor implements AfterViewInit, OnDestroy {
  @Input() content = 'Start writing your content here...';
  @Input() title = '';

  @Output() contentChange = new EventEmitter<string>();
  @Output() titleChange = new EventEmitter<string>();

  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLDivElement>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>;

  isUploading = false;
  previewMode = false;

  constructor(private uploadImage: UploadImage) {}

  ngAfterViewInit(): void {
    if (this.textareaRef) {
      this.textareaRef.nativeElement.innerHTML = this.content;
    }
  }

  ngOnDestroy(): void {
    // Optional: cleanup if needed per-component basis
  }

  /**
   * Handle image selection and insertion into editor
   */
  onImageSelected(event: Event): void {
    this.uploadImage.onImageSelected(event, (imgHtml: string) => {
      const div = this.textareaRef.nativeElement;
      div.innerHTML += imgHtml;
      this.onContentChange();
    });
  }

  /**
   * Apply text formatting (bold, italic, etc.)
   */
  applyFormat(
    prefix: string,
    suffix: string,
    placeholder: string,
    event?: MouseEvent
  ): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || placeholder;

    const span = document.createElement('span');
    span.innerHTML = `${prefix}${selectedText}${suffix}`;

    range.deleteContents();
    range.insertNode(span);

    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    this.onContentChange();
  }

  /**
   * Capture content changes
   */
  onContentChange(): void {
    const div = this.textareaRef.nativeElement;
    this.content = div.innerHTML;
    this.contentChange.emit(this.content);
  }

  /**
   * Trigger video input (placeholder for future video support)
   */
  selectVideo(): void {
    if (this.videoInput) {
      this.videoInput.nativeElement.click();
    }
  }

  /**
   * Handle video selection (can be implemented when ready)
   */
  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      console.log('No video file selected');
      return;
    }

    if (!file.type.startsWith('video/')) {
      console.error('Selected file is not a video');
      return;
    }

    console.log('Video selected:', file.name);
    // Future implementation for video handling
  }
}