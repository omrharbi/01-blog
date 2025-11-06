import { Component, ElementRef, Input, input, Output, output, signal, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { RequestEditProfile, Skills } from '../../../core/models/user/userProfileRequest';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { ProfileService } from '../../../core/service/servicesAPIREST/profile/profile-service';

@Component({
  selector: 'app-edit-profile',
  imports: [Materaile],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile {
  constructor(private uploadImage: UploadImage, private editInof: ProfileService) { }
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
  newFiles: File[] = [];
  infoUserUpdate = signal<RequestEditProfile | null>(null);

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
    this.uploadImage.clearFiles();
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
  saveProfile() {
    this.newFiles = this.uploadImage.uploadfiles();

    this.infoUserUpdate.set({
      firstname: this.firstname(),
      lastname: this.lastname(),
      // avatar: this.newFiles[0].name,
      skills: this.AllSkills(),
      email: this.email(),
      about: this.about()
    });

    const info = this.infoUserUpdate();
    const file = this.newFiles?.[0] ?? null; //
    if (info) {
      this.editInof.editProfile(info, file).subscribe({
        next: response => console.log(response, "done"),
        error: error => console.log(error)
      });
    }

  }
}
