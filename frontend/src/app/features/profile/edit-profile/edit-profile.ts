import { Component, ElementRef, Input, input, Output, output, signal, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { Skills } from '../../../core/models/user/userProfileRequest';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';

@Component({
  selector: 'app-edit-profile',
  imports: [Materaile],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile {
  constructor(private uploadImage: UploadImage) { }
  @Input() profileEdite: boolean = false;
  firstname = signal("")
  lastname = signal("")
  username = signal("")
  email = signal("")
  about = signal("")
  skills = signal<string>("")
  AllSkills = signal<Skills[]>([]);
  coverImageSrc = signal("");
  isSelect = signal(false);
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  addSkill() {
    if ((this.skills().trim() !== "" && this.skills().trim() != null) && this.skills.length < 8) {
      const existSkills = this.AllSkills().some(skils => skils.skills === this.skills())
      if (!existSkills) {
        const newSkills: Skills = {
          skills: this.skills()
        };
        this.AllSkills.update(oldSkills => [...oldSkills, newSkills])
      }
    }
    this.skills.set("")
    console.log(this.AllSkills());


  }
  onImageSelected(event: Event) {
    this.uploadImage.onImageSelected(event, (imgHTML: string) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(imgHTML, 'text/html');
      const img = doc.querySelector('img');
      if (img) {
        this.coverImageSrc.set(img.src);
        this.isSelect.set(true);
      }
    });
  }

  removeTag(index: number) {
    // this.tags.splice(index, 1);
  }
  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }

  remove() {
    this.coverImageSrc.set("")
  }
  addExperience() { }
  removeExperience() { }
  saveProfile() { }
}
