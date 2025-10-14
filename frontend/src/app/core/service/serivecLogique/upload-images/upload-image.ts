import { Injectable } from '@angular/core';
import { MediaRequest } from '../../../models/postData/postRequest';
import { Uploadimages } from '../../servicesAPIREST/uploadImages/uploadimages';
import { PostResponse } from '../../../models/postData/postResponse';
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
    const randomFileName = this.generateRandomFileName(file.name);
    const fileWithRandomName = new File([file], randomFileName, { type: file.type });
    console.log('Selected image file:', fileWithRandomName.name, 'Size:', file.size, 'Type:', file.type);
    const mediaRequest: MediaRequest = {
      filename: file.name,
      filePath: URL.createObjectURL(file),
      fileType: file.type,
      fileSize: file.size,
      displayOrder: this.currentDisplayOrder++
    };
    this.medias.push(mediaRequest);
    // Create new File object with random name
    this.fileUpload.push(fileWithRandomName)
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      this.uploadMessage = 'Please select a valid image file';
      return;
    }
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      this.selectImage(callback);
    }
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
    reader.readAsDataURL(file); // read file as base64

  }
  returnfiles(): MediaRequest[] {

    return this.medias;
  }
  uploadfiles(): File[] {
    return this.fileUpload;
  }

  replaceImage(html: string, post: PostResponse): string {

    let index = 0;
    const media = post.medias ?? [];


    const processHtml = html.replace(
      /<img([^>]*) ([^>]*)>/gi,
      (match, after) => {
        if (index < media.length) {
          const image = media[index]
          index++;
          return `<img class ="imageMa image-prview" src="${apiUrl}${image.filePath}" alt="${'Post image'}"${after}>`
        }
        return match
      }
    )
    return processHtml;
  }
}
