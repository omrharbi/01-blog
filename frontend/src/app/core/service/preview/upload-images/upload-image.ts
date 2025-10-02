import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadImage {
  selectedImageFile?: File;
  selectedVideoFile?: File;
  uploadMessage = '';
  onImageSelected(event: Event, callback: (imgHTML: string) => void) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    console.log('Selected image file:', file.name, 'Size:', file.size, 'Type:', file.type);
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

  selectImage(callback: (imgHTML: string) => void) {
    const file = this.selectedImageFile;

    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Insert image HTML into the content
      const imgHTML = `<img src="${reader.result}" class="imageMa">`;
      // this.onContentChange(); // update content and emit
      callback(imgHTML);
    };

    reader.readAsDataURL(file); // read file as base64
  }
}
