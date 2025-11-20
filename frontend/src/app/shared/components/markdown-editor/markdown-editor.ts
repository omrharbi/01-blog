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

  constructor(private uploadImage: UploadImage) { }

  ngAfterViewInit(): void {
    if (this.textareaRef) {
      this.textareaRef.nativeElement.innerHTML = this.content;
    }
  }

  ngOnDestroy(): void {
    // Optional: cleanup if needed per-component basis
  }

  onImageSelected(event: Event): void {
    this.uploadImage.onImageSelected(event, (imgHtml: string) => {
      const div = this.textareaRef.nativeElement;
      div.innerHTML += imgHtml;
      this.onContentChange();
    });
  }

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

    // Special handling for headings
    if (prefix === '## ' || prefix === '### ') {
      const headingLevel = prefix === '## ' ? 2 : 3;
      const heading = document.createElement(`h${headingLevel}`);
      heading.className = `H${headingLevel}MarkDown`;
      heading.textContent = selectedText;

      range.deleteContents();
      range.insertNode(heading);

      // Move cursor after heading
      const newRange = document.createRange();
      newRange.setStartAfter(heading);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Regular formatting
      const span = document.createElement('span');
      span.innerHTML = `${prefix}${selectedText}${suffix}`;

      range.deleteContents();
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.setStartAfter(span);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    this.onContentChange();
  }

  onContentChange(): void {
    const div = this.textareaRef.nativeElement;
    this.content = div.innerHTML;
    this.contentChange.emit(this.content);
  }


  selectVideo(): void {
    if (this.videoInput) {
      this.videoInput.nativeElement.click();
    }
  }


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

    this.uploadImage.onImageSelected(event, (imgHtml: string) => {
      const div = this.textareaRef.nativeElement;
      div.innerHTML += imgHtml;
      this.onContentChange();
    });
    // Future implementation for video handling
  }
}