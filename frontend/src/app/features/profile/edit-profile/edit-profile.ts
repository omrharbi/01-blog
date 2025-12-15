import { Component, ElementRef, EventEmitter, Input, input, Output, output, signal, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { RequestEditProfile } from '../../../core/models/user/userProfileRequest';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { ProfileService } from '../../../core/service/servicesAPIREST/profile/profile-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileServiceLogique } from '../../../core/service/serivecLogique/profile/profile-service-profile';

@Component({
  selector: 'app-edit-profile',
  imports: [Materaile],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile {
  constructor(private uploadImage: UploadImage, private editInof: ProfileService, private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileServiceLogique
  ) { }
  @Input() profileEdite: boolean = false;
  firstname = signal("")
  lastname = signal("")
  username = signal("")
  email = signal("")
  about = signal("")
  skills = signal<string>("")
  AllSkills = signal<string[]>([]);
  coverImageSrc = signal("");
  isSelect = signal(false);
  newFiles: File[] = [];
  infoUserUpdate = signal<RequestEditProfile | null>(null);

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @Output() profileUpdated = new EventEmitter<any>();
  addSkill() {
    if ((this.skills().trim() !== "" && this.skills().trim() != null) && this.skills.length < 8) {
      const existSkills = this.AllSkills().some(skils => skils === this.skills())
      if (!existSkills) {
        this.AllSkills.update(oldSkills => [...oldSkills, this.skills().trim()])
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
  countChar(): number {
    return this.about().length;
  }
  removeExperience() { }
  saveProfile() {
    this.newFiles = this.uploadImage.uploadfiles();
    this.infoUserUpdate.set({
      firstname: this.firstname().trim(),
      lastname: this.lastname().trim(),
      username: this.username().trim(),

      skills: this.AllSkills(),
      email: this.email().trim(),
      about: this.about().trim()
    });

    const info = this.infoUserUpdate();
    const file = this.newFiles?.[0] ?? null; //
    if (info) {
      this.editInof.editProfile(info, file).subscribe({
        next: response => {
          this.profileUpdated.emit(response);

          // Close modal or reset form
          // this.closeModal();
        },
        error: error => console.log(error)
      });
    }

  }
}
