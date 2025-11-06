import { Component, Input, input, Output, output, signal } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { Skills } from '../../../core/models/user/userProfileRequest';

@Component({
  selector: 'app-edit-profile',
  imports: [Materaile],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile {
  @Input() profileEdite: boolean = false;
  firstname = signal("")
  lastname = signal("")
  username = signal("")
  email = signal("")
  about = signal("")
  skills = signal<string>("")
  AllSkills = signal<Skills[]>([]);
  addSkill() {
    if ( (this.skills().trim() !=="" &&  this.skills().trim() != null) && this.skills.length < 8 ) {
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

  // set skillsInput(value: string) {
  //   this.skills.set(value);
  // }
  addExperience() { }
  removeExperience() { }
  saveProfile() { }
}
