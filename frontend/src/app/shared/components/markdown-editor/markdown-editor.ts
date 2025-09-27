import { Component, ElementRef, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-markdown-editor',
  imports: [Materaile],
  templateUrl: './markdown-editor.html',
  styleUrls: ['./markdown-editor.scss'],
})
export class MarkdownEditor {
  content: string = '# Welcome to Advanced Markdown Editor\n\nStart writing your content here...';
  showPreview: boolean = true;
  private _imageMarkdownMap: string[] = [];
  private _videoHtmlMap: string[] = [];
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>;

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

    // Restore cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selectedText || placeholder).length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  // 📷 Handle image upload
  handleImageUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const filenameText = `[Image: ${file.name}]`;
          this.content += `\n${filenameText}\n`;

          const imageMarkdown = `![${file.name}](${(e.target as FileReader).result})\n`;
          this._imageMarkdownMap = this._imageMarkdownMap || [];
          this._imageMarkdownMap.push(imageMarkdown);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 🎥 Handle video upload
  handleVideoUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const videoMarkdown = `\n<video controls width="100%">\n  <source src="${
            (e.target as FileReader).result
          }" type="${file.type}">\n</video>\n`;
          this.content += videoMarkdown;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 📝 Convert Markdown to HTML
  markdownToHtml(markdown: string): string {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/gim,
        '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />'
      )
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^[0-9]+\. (.*$)/gim, '<ol><li>$1</li></ol>')
      .replace(/\n/gim, '<br>');
  }

  // 💾 Save content (simulate API call)
  saveContent() {
    console.log('Saving to backend...', {
      title: this.content.split('\n')[0].replace(/^#+ /, ''),
      content: this.content,
      htmlContent: this.markdownToHtml(this.content),
    });

    alert('Content would be saved to the backend!');
  }

  // 🌍 Open full blog preview
  openFullPreview() {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Blog Post Preview</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              img, video { max-width: 100%; height: auto; }
              blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 16px; }
              code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
              pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
            </style>
          </head>
          <body>${this.markdownToHtml(this.content)}</body>
        </html>
      `);
      newWindow.document.close();
    }
  }
}
