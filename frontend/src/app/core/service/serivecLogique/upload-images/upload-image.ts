import { Injectable } from '@angular/core';
import { MediaRequest } from '../../../models/post/postRequest';
import { Uploadimages } from '../../servicesAPIREST/uploadImages/uploadimages';
import { MediaResponse, PostResponse } from '../../../models/post/postResponse';
import { apiUrl } from '../../../constant/constante';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UploadImage {
  constructor(private toasterService: ToastrService) { }

  selectedImageFile?: File;
  selectedVideoFile?: File;
  uploadMessage = '';
  medias: MediaRequest[] = [];
  fileUpload: File[] = [];
  currentDisplayOrder = 0;

  onImageSelected(event: Event, callback: (imgHTML: string) => void) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log(file, "file ");

    if (!file) {
      console.log('No file selected');
      return;
    }


    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', this.formatFileSize(file.size), 'max allowed: 100MB');
      this.uploadMessage = `File size ${this.formatFileSize(file.size)} exceeds 100MB limit`;
      this.toasterService.error(this.uploadMessage);
      // Clear the file input
      input.value = '';
      return;
    }
    // Validate file type first
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime'];

    if (!allowedTypes.some(type => file.type.startsWith(type.replace(/\/.*$/, '/')))) {
      console.error('Invalid file type:', file.type);
      this.uploadMessage = 'Please select a valid image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG) file';

      // Clear the file input
      this.toasterService.error(this.uploadMessage);

      input.value = '';
      return;
    }

    // Create file with random name
    const randomFileName = this.generateRandomFileName(file.name);
    const fileWithRandomName = new File([file], randomFileName, { type: file.type });
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
    this.selectImage(file.type, callback);

    // console.log('Total files ready for upload:', this.fileUpload.length);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  selectImage(type: string, callback: (imgHTML: string) => void) {
    const file = this.selectedImageFile;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let imgHTML = "";
      if (type.startsWith("image/")) {
        imgHTML = `<img src="${reader.result}" class="imageMa">`;
      }

      if (type.startsWith("video/")) {
        imgHTML = `
          <video controls class="videoMa">
            <source src="${reader.result}" type="${type}">
            Your browser does not support the video tag.
          </video>
        `;
      }
      callback(imgHTML);
    };
    reader.readAsDataURL(file);
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


  returnfiles(): MediaRequest[] {
    return this.medias;
  }

  uploadfiles(): File[] {
    // console.log('uploadfiles() called - returning', this.fileUpload.length, 'files');
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
          return `<div class="image-post"> <img class="imageMa image-preview" src="${apiUrl}${image.filePath}" alt="Post image"${after}> </div>`;
        }
        return match;
      }
    );

    return processHtml;
  }
}