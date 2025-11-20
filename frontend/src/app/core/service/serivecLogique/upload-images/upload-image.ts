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
  isCoverImage = false;

  onImageSelected(event: Event, callback: (imgHTML: string) => void, isCover: boolean = false) {
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
      input.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mpeg', 'video/ogg', 'video/webm',];

    if (!allowedTypes.some(type => file.type.startsWith(type.replace(/\/.*$/, '/')))) {
      console.error('Invalid file type:', file.type);
      this.uploadMessage = 'Please select a valid image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG) file';
      this.toasterService.error(this.uploadMessage);
      input.value = '';
      return;
    }

    // Create file with random name
    const randomFileName = this.generateRandomFileName(file.name);
    const fileWithRandomName = new File([file], randomFileName, { type: file.type });

    // If this is a cover image, handle it separately
    if (isCover) {
      // Remove any existing cover image first
      this.removeCoverImage();
      this.fileUpload.unshift(fileWithRandomName);
      this.isCoverImage = true;
    } else {
      this.fileUpload.push(fileWithRandomName);
    }

    // Create media request for preview
    const mediaRequest: MediaRequest = {
      filename: randomFileName,
      filePath: URL.createObjectURL(file),
      fileType: file.type,
      fileSize: file.size,
      displayOrder: isCover ? 0 : this.currentDisplayOrder++,
      isCoverImage: isCover // Add flag to identify cover images
    };

    // If cover image, add at beginning, otherwise add at end
    if (isCover) {
      this.medias.unshift(mediaRequest);
      // Update display order for other medias
      this.medias.forEach((media, index) => {
        media.displayOrder = index;
      });
      this.currentDisplayOrder = this.medias.length;
    } else {
      this.medias.push(mediaRequest);
    }

    this.selectedImageFile = file;
    this.selectImage(file.type, callback);
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

  removeFileByName(filename: string) {
    // Find and remove from fileUpload array
    const fileIndex = this.fileUpload.findIndex(file => file.name === filename);
    if (fileIndex !== -1) {
      this.fileUpload.splice(fileIndex, 1);
    }

    // Find and remove from medias array
    const mediaIndex = this.medias.findIndex(media => media.filename === filename);
    if (mediaIndex !== -1) {
      // Revoke object URL to prevent memory leak
      if (this.medias[mediaIndex].filePath.startsWith('blob:')) {
        URL.revokeObjectURL(this.medias[mediaIndex].filePath);
      }
      this.medias.splice(mediaIndex, 1);
    }

    // Update display order for remaining medias
    this.medias.forEach((media, index) => {
      media.displayOrder = index;
    });

    // Reset current display order
    this.currentDisplayOrder = this.medias.length;

    console.log('Removed file:', filename, '- Remaining files:', this.fileUpload.length);
  }

  // Helper method to remove cover image specifically
  private removeCoverImage() {
    const coverIndex = this.medias.findIndex(media => media.filename);
    if (coverIndex !== -1) {
      const coverFilename = this.medias[coverIndex].filename;
      if (coverFilename)
        this.removeFileByName(coverFilename);
    }

    // Remove cover from fileUpload
    const coverFileIndex = this.fileUpload.findIndex(file => {
      const media = this.medias.find(m => m.filename === file.name);
      return media && media.isCoverImage;
    });
    if (coverFileIndex !== -1) {
      this.fileUpload.splice(coverFileIndex, 1);
    }

    this.isCoverImage = false;
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
    this.isCoverImage = false;
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

  getCoverImageFilename(): string {
    const coverMedia = this.medias.find(media => media.isCoverImage);
    if (coverMedia && coverMedia.filename) {
      return coverMedia.filename;
    }
    return '';
  }

}