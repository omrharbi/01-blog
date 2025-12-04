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
    if (!markdown) return "";

    // Normalize line breaks
    let text = markdown.replace(/<br\s*\/?>/gi, "\n");
    text = text.replace(/<\/?span[^>]*>/gi, "");

    const lines = text.split(/\r?\n/);
    const out: string[] = [];

    for (let line of lines) {
      line = line.trim();
      if (line === "") {
        out.push("");
        continue;
      }

      // Headers
      const h3 = line.match(/^###\s+(.+)$/);
      if (h3) {
        out.push(`<h3 class="H3MarkDown">${h3[1].trim()}</h3>`);
        continue;
      }

      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        out.push(`<h2 class="H2MarkDown">${h2[1].trim()}</h2>`);
        continue;
      }

      out.push(line);
    }

    let result = out.join("\n");

    // Inline formatting
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="strongMarkDown">$1</strong>');
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="EmMarkDown">$1</em>');
    result = result.replace(/~~(.+?)~~/g, '<del class="DelMarkDown">$1</del>');
    result = result.replace(/`(.+?)`/g, '<code class="CodeMarkDown">$1</code>');

    // Wrap plain lines in <p> if not HTML
    result = result
      .split("\n")
      .map((ln) => {
        const t = ln.trim();
        if (t === "") return "";
        if (/^\s*<\/?\w+/.test(t)) return t; // already HTML
        return `<p>${t}</p>`;
      })
      .join("\n");

    return result;
  }


}
