import { Injectable } from '@angular/core';
import { MediaRequest } from '../../../models/postData/postRequest';
import { MediaResponse, PostResponse } from '../../../models/postData/postResponse';
import { apiUrl } from '../../../constant/constante';

@Injectable({
  providedIn: 'root',
})
export class UploadImage {
  // Track images by their blob URL to manage lifecycle
  private imageMap = new Map<string, { media: MediaRequest; file: File }>();
  private displayOrderCounter = 0;

  clearAll() {
    this.revokeAllObjectURLs();
    this.imageMap.clear();
    this.displayOrderCounter = 0;
  }

  /**
   * Handle single image selection
   */
  onImageSelected(event: Event, callback: (imgHTML: string) => void) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    const randomFileName = this.generateRandomFileName(file.name);
    const fileWithRandomName = new File([file], randomFileName, { type: file.type });

    const mediaRequest: MediaRequest = {
      filename: file.name,
      filePath: blobUrl,
      fileType: file.type,
      fileSize: file.size,
      displayOrder: this.displayOrderCounter++
    };

    // Store in map with blob URL as key
    this.imageMap.set(blobUrl, { media: mediaRequest, file: fileWithRandomName });

    // Generate HTML callback
    const imgHTML = `<img src="${blobUrl}" class="imageMa" data-blob-url="${blobUrl}">`;
    callback(imgHTML);
  }

  /**
   * Convert existing media from backend to File objects (for edit mode)
   */
  convertToFile(media: MediaResponse[]): File[] {
    media.forEach((item) => {
      const randomFileName = this.generateRandomFileName(item.filename);
      const fileWithRandomName = new File([item.filename], randomFileName, {
        type: item.fileType,
      });

      const mediaRequest: MediaRequest = {
        filename: item.filename,
        filePath: item.filePath, // Keep backend path
        fileType: item.fileType,
        fileSize: item.fileSize,
        displayOrder: this.displayOrderCounter++
      };

       this.imageMap.set(item.filePath, { media: mediaRequest, file: fileWithRandomName });
    });

    return Array.from(this.imageMap.values()).map(v => v.file);
  }

 
  getMedias(): MediaRequest[] {
    return Array.from(this.imageMap.values()).map(v => v.media);
  }
 
  getFiles(): File[] {
    return Array.from(this.imageMap.values()).map(v => v.file);
  }

  
  getNewFiles(): File[] {
    const newFiles: File[] = [];
    this.imageMap.forEach((value, key) => {
      if (key.startsWith('blob:')) {
        newFiles.push(value.file);
      }
    });
    return newFiles;
  }

 
  getExistingFiles(): File[] {
    const existingFiles: File[] = [];
    this.imageMap.forEach((value, key) => {
      if (!key.startsWith('blob:')) {
        existingFiles.push(value.file);
      }
    });
    return existingFiles;
  }

  /**
   * Remove image by its source URL
   */
  removeImageBySrc(src: string): void {
    if (this.imageMap.has(src)) {
      if (src.startsWith('blob:')) {
        URL.revokeObjectURL(src);
      }
      this.imageMap.delete(src);
    }
  }

  /**
   * Sync images with HTML content - remove images not present in HTML
   */
  syncImagesWithContent(html: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgElements = doc.querySelectorAll('img');
    const usedSrcs = new Set<string>();

    imgElements.forEach(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-blob-url');
      if (src) {
        usedSrcs.add(src);
      }
    });

    // Remove images not in current content
    const toRemove: string[] = [];
    this.imageMap.forEach((value, src) => {
      if (!usedSrcs.has(src)) {
        toRemove.push(src);
      }
    });

    toRemove.forEach(src => this.removeImageBySrc(src));
  }

  /**
   * Replace blob URLs with backend paths for display
   */
  replaceImageSrcs(html: string, medias: MediaResponse[]): string {
    if (!medias || medias.length === 0) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    
    let mediaIndex = 1;
    images.forEach(img => {
      if (mediaIndex < medias.length) {
        const media = medias[mediaIndex];
        img.src = `${apiUrl}${media.filePath}`;
        img.setAttribute('data-media-id', mediaIndex.toString());
        mediaIndex++;
      }
    });

    return doc.body.innerHTML;
  }

  /**
   * Remove all img tags from HTML
   */
  removeImageTags(html: string): string {
    return html.replace(/<img\b[^>]*>/gi, '');
  }

  /**
   * Clear src attributes from all images (for sending to backend)
   */
  clearImageSrcs(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      img.src = '';
    });
    return doc.body.innerHTML;
  }

  /**
   * Generate random file name
   */
  private generateRandomFileName(originalFileName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalFileName.split('.').pop();
    return `${timestamp}_${random}.${extension}`;
  }

  /**
   * Revoke all blob URLs to free memory
   */
  private revokeAllObjectURLs(): void {
    this.imageMap.forEach((value, src) => {
      if (src.startsWith('blob:')) {
        URL.revokeObjectURL(src);
      }
    });
  }
}