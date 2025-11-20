import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  private previewHtml = '';
  setPreviewHtml(html: string) {
    this.previewHtml = html;
  }

  getPreviewHtml(): string {
    return this.previewHtml;
  }

renderMarkdownWithMedia(markdown: string): string {
  return (
    markdown
 
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?span[^>]*>/gi, '')
      
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
      
      // Headers - FIXED: match after newline OR at start
      .replace(/(^|\n)###\s+([^\n<]+)/g, '$1<h3 class="H3MarkDown">$2</h3>')
      .replace(/(^|\n)##\s+([^\n<]+)/g, '$1<h2 class="H2MarkDown">$2</h2>')
      
      // Basic markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="strongMarkDown">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="EmMarkDown">$1</em>')
      .replace(/~~(.*?)~~/g, '<del class="DelMarkDown">$1</del>')
      .replace(/`(.*?)`/g, '<code class="CodeMarkDown">$1</code>')
      .replace(/(^|\n)>\s+([^\n]+)/g, '$1<blockquote class="blockquoteMarkDown">$2</blockquote>')
      .replace(/(^|\n)-\s+([^\n]+)/g, '$1<li class="LisMarkDown">$2</li>')
  );
}
}
