import { Injectable } from '@angular/core';
import { MediaRequest } from '../../../models/post/postRequest';
import { Uploadimages } from '../../servicesAPIREST/uploadImages/uploadimages';
import { MediaResponse, PostResponse } from '../../../models/post/postResponse';
import { apiUrl } from '../../../constant/constante';

@Injectable({
  providedIn: 'root',
})
export class UploadImage {
  constructor(private files: Uploadimages) { }

  selectedImageFile?: File;
  selectedVideoFile?: File;
  uploadMessage = '';
  medias: MediaRequest[] = [];
  fileUpload: File[] = [];
  currentDisplayOrder = 0;

  onImageSelected(event: Event, callback: (imgHTML: string) => void) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type first
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      this.uploadMessage = 'Please select a valid image file';
      return;
    }

    // Create file with random name
    const randomFileName = this.generateRandomFileName(file.name);
    const fileWithRandomName = new File([file], randomFileName, { type: file.type });

    console.log('Selected image file:', fileWithRandomName.name, 'Size:', file.size, 'Type:', file.type);

    // Add to fileUpload array (this is what gets sent to backend)
    this.fileUpload.push(fileWithRandomName);

    // Create media request for preview (use original file for createObjectURL)
    const mediaRequest: MediaRequest = {
      filename: randomFileName, // Use the random filename here too
      filePath: URL.createObjectURL(file),
      fileType: file.type,
      fileSize: file.size,
      displayOrder: this.currentDisplayOrder++
    };
    this.medias.push(mediaRequest);

    // Set selected image and trigger callback
    this.selectedImageFile = file;
    this.selectImage(callback);

    console.log('Total files ready for upload:', this.fileUpload.length);
  }

  clearFiles() {
    // Revoke object URLs to prevent memory leaks
    this.medias.forEach(media => {
      if (media.filePath.startsWith('blob:')) {
        URL.revokeObjectURL(media.filePath);
      }
    });

    this.medias = [];
    this.fileUpload = [];
    this.currentDisplayOrder = 0;
    this.selectedImageFile = undefined;
    this.selectedVideoFile = undefined;
  }

  generateRandomFileName(originalFileName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalFileName.split('.').pop();
    return `${timestamp}_${random}.${extension}`;
  }

  selectImage(callback: (imgHTML: string) => void) {
    const file = this.selectedImageFile;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgHTML = `<img src="${reader.result}" class="imageMa">`;
      callback(imgHTML);
    };
    reader.readAsDataURL(file);
  }

  returnfiles(): MediaRequest[] {
    return this.medias;
  }

  uploadfiles(): File[] {
    console.log('uploadfiles() called - returning', this.fileUpload.length, 'files');
    return this.fileUpload;
  }

  replaceImage(html: string, post: PostResponse): string {
    let index = 1; 
    const media = post.medias ?? [];

    const processHtml = html.replace(
      /<img([^>]*) ([^>]*)>/gi,
      (match, after) => {
        if (index < media.length) {
          const image = media[index];
          index++;
          return `<img class="imageMa image-preview" src="${apiUrl}${image.filePath}" alt="Post image"${after}>`;
        }
        return match;
      }
    );

    return processHtml;
  }
}