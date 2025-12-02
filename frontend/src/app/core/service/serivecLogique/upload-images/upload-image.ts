import { Injectable } from '@angular/core';
import { MediaRequest } from '../../../models/post/postRequest';
import { PostResponse } from '../../../models/post/postResponse';
import { apiUrl } from '../../../constant/constante';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UploadImage {
  constructor(private toasterService: ToastrService) { }

  selectedImageFile?: File;
  uploadMessage = '';
  medias: MediaRequest[] = [];
  fileUpload: File[] = [];
  coverImageFile?: File;
  coverImageMedia?: MediaRequest;
  contentDisplayOrder = 1; // Start from 1, cover is 0

  onImageSelected(
    event: Event,
    callback: (imgHTML: string, filename: string) => void,
    isCover: boolean = false
  ) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      console.log('No file selected');
      return;
    }

    // Cover image: only ONE image allowed
    if (isCover) {
      if (files.length > 1) {
        this.toasterService.warning('Cover image: Only one image allowed');
        input.value = '';
        return;
      }

      const file = files[0];

      // Cover must be image only (no videos)
      if (!file.type.startsWith('image/')) {
        this.toasterService.error('Cover image must be an image file (no videos)');
        input.value = '';
        return;
      }

      this.processSingleFile(file, callback, true);
      input.value = '';
      return;
    }

    // Content: multiple images/videos allowed
    Array.from(files).forEach((file) => {
      this.processSingleFile(file, callback, false);
    });

    input.value = '';
  }

  private processSingleFile(
    file: File,
    callback: (imgHTML: string, filename: string) => void,
    isCover: boolean
  ) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      this.uploadMessage = `File ${file.name} size ${this.formatFileSize(file.size)} exceeds 100MB limit`;
      this.toasterService.error(this.uploadMessage);
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/eps',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
    ];

    if (!allowedTypes.some((type) => file.type.startsWith(type.replace(/\/.*$/, '/')))) {
      this.uploadMessage = `Invalid file type: ${file.type}`;
      this.toasterService.error(this.uploadMessage);
      return;
    }

    const randomFileName = this.generateRandomFileName(file.name);
    const fileWithRandomName = new File([file], randomFileName, { type: file.type });

    if (isCover) {
      // Remove previous cover if exists
      if (this.coverImageFile && this.coverImageMedia) {
        URL.revokeObjectURL(this.coverImageMedia.filePath);
      }

      this.coverImageFile = fileWithRandomName;
      this.coverImageMedia = {
        filename: randomFileName,
        filePath: URL.createObjectURL(file),
        fileType: file.type,
        fileSize: file.size,
        displayOrder: 0, // Cover is always 0
      };
    } else {
      // Content image/video
      this.fileUpload.push(fileWithRandomName);
      const mediaRequest: MediaRequest = {
        filename: randomFileName,
        filePath: URL.createObjectURL(file),
        fileType: file.type,
        fileSize: file.size,
        displayOrder: this.contentDisplayOrder++,
      };
      this.medias.push(mediaRequest);
    }

    this.selectedImageFile = file;
    this.selectImage(file.type, randomFileName, callback);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  selectImage(type: string, filename: string, callback: (imgHTML: string, filename: string) => void) {
    const file = this.selectedImageFile;
    if (!file) return;
    console.log("    ***********", "vid");

    const reader = new FileReader();
    reader.onload = () => {
      let imgHTML = '';
      if (type.startsWith('image/')) {
        imgHTML = `<img src="${reader.result}" class="imageMa" data-filename="${filename}">`;
      }

      if (type.startsWith('video/')) {
        imgHTML = `<video controls class="videoMa" data-filename="${filename}"><source src="${reader.result}" type="${type}">Your browser does not support the video tag.</video>`;


      }
      callback(imgHTML, filename);
    };
    reader.readAsDataURL(file);
  }

  removeFileByName(filename: string) {
    // Check if it's the cover image
    if (this.coverImageMedia && this.coverImageMedia.filename === filename) {
      URL.revokeObjectURL(this.coverImageMedia.filePath);
      this.coverImageFile = undefined;
      this.coverImageMedia = undefined;
      console.log('Removed cover image:', filename);
      return;
    }

    // Remove from content images
    const fileIndex = this.fileUpload.findIndex((file) => file.name === filename);
    if (fileIndex !== -1) {
      this.fileUpload.splice(fileIndex, 1);
    }

    const mediaIndex = this.medias.findIndex((media) => media.filename === filename);
    if (mediaIndex !== -1) {
      if (this.medias[mediaIndex].filePath.startsWith('blob:')) {
        URL.revokeObjectURL(this.medias[mediaIndex].filePath);
      }
      this.medias.splice(mediaIndex, 1);
    }

    // Reorder remaining content medias
    this.medias.forEach((media, index) => {
      media.displayOrder = index + 1; // +1 because cover is 0
    });

    console.log('Removed content file:', filename);
  }

  // Reorder content files based on actual content order (cover always stays 0)
  reorderFilesBasedOnContent(htmlContent: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const allMedia = doc.querySelectorAll('img[data-filename], video[data-filename]');

    const orderedFilenames: string[] = [];
    allMedia.forEach((element) => {
      const filename = element.getAttribute('data-filename');
      if (filename && filename !== this.coverImageMedia?.filename) {
        // Exclude cover image from content ordering
        orderedFilenames.push(filename);
      }
    });

    // Reorder content medias array based on content order
    const reorderedMedias: MediaRequest[] = [];
    const reorderedFiles: File[] = [];

    orderedFilenames.forEach((filename, index) => {
      const mediaIndex = this.medias.findIndex((m) => m.filename === filename);
      if (mediaIndex !== -1) {
        const media = { ...this.medias[mediaIndex], displayOrder: index + 1 }; // +1 for cover
        reorderedMedias.push(media);
      }

      const fileIndex = this.fileUpload.findIndex((f) => f.name === filename);
      if (fileIndex !== -1) {
        reorderedFiles.push(this.fileUpload[fileIndex]);
      }
    });

    this.medias = reorderedMedias;
    this.fileUpload = reorderedFiles;
    this.contentDisplayOrder = this.medias.length + 1;
  }

  clearFiles() {
    // Clear cover image
    if (this.coverImageMedia) {
      URL.revokeObjectURL(this.coverImageMedia.filePath);
    }
    this.coverImageFile = undefined;
    this.coverImageMedia = undefined;

    // Clear content images
    this.medias.forEach((media) => {
      if (media.filePath.startsWith('blob:')) {
        URL.revokeObjectURL(media.filePath);
      }
    });

    this.medias = [];
    this.fileUpload = [];
    this.contentDisplayOrder = 1;
    this.selectedImageFile = undefined;
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

  // Get ALL files including cover (cover first)
  uploadfiles(): File[] {
    const allFiles: File[] = [];

    // Cover image first
    if (this.coverImageFile) {
      allFiles.push(this.coverImageFile);
    }

    // Then content files in order
    allFiles.push(...this.fileUpload);

    return allFiles;
  }

  // Get all medias including cover
  getAllMedias(): MediaRequest[] {
    const allMedias: MediaRequest[] = [];

    if (this.coverImageMedia) {
      allMedias.push(this.coverImageMedia);
    }

    allMedias.push(...this.medias);

    return allMedias;
  }

  getCoverImage(): { file?: File; media?: MediaRequest } {
    return {
      file: this.coverImageFile,
      media: this.coverImageMedia,
    };
  }

  hasCoverImage(): boolean {
    return !!this.coverImageFile && !!this.coverImageMedia;
  }

  replaceImage(html: string, post: PostResponse): string {
    let index = 1;
    const media = post.medias ?? [];
    if (!media.length) return html;

    const processHtml = html.replace(/<img([^>]*) ([^>]*)>/gi, (match, after) => {

      if (index >= media.length) { return match; }
      const image = media[index++];
      return `<div class="image-post"> <img class="imageMa image-preview" src="${apiUrl}${image.filePath}" alt="Post image"${after}> </div>`;

    }).replace(/<video([^>]*)>([\s\S]*?)<\/video>/gi, (match, attrs, content) => {
      if (index >= media.length) { return match; }
      const vidoe = media[index++]
      return `<div class="video-post">
                <video class="video-preview videoMa" controls ${attrs}>
                  <source src="${apiUrl}${vidoe.filePath}" type="${vidoe.fileType}">
                </video>
              </div>`;

    });

    return processHtml;
  }
}