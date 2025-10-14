import { Component } from '@angular/core';
import { EditProfile } from './edit-profile/edit-profile';
import { Materaile } from '../../modules/materaile-module';

@Component({
  selector: 'app-profile',
  imports: [EditProfile,Materaile],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  editProfile = false;
  EditPorfile() {
    this.editProfile = !this.editProfile;
  }
}
