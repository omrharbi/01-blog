import { Component } from '@angular/core';
import { EditProfile } from './edit-profile/edit-profile';
import { Materaile } from '../../modules/materaile-module';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { ProfileService } from '../../core/service/servicesAPIREST/profile/profile-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { PostResponse } from '../../core/models/post/postResponse';
import { UploadImage } from '../../core/service/serivecLogique/upload-images/upload-image';
import { PreviewService } from '../../core/service/serivecLogique/preview/preview.service';
import { apiUrl } from '../../core/constant/constante';

@Component({
  selector: 'app-profile',
  imports: [EditProfile, Materaile],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  constructor(private auth: AuthService, private profile: ProfileService, private replceimge: UploadImage, private preview: PreviewService) { }
  isAuthenticated: boolean = false;
  editProfile = false;
  userProfile: UserProfile = {
    id: "",
    firstname: "",
    lastname: "",
    about: "",
    username: "",
    avatar: "",
  };
  apiUrl = apiUrl;

  post: PostResponse[] = [];
  EditPorfile() {
    this.editProfile = !this.editProfile;
  }
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    this.profile.profile().subscribe(res => {
      this.userProfile = res.data;
      console.log(this.userProfile);
    })

    this.profile.GetMyPosts().subscribe(res => {
      this.post = res.data;
      console.log(this.post, "ppp");
      // let htmlContent = this.replceimge.replaceImage(this.post.htmlContent ?? "", this.post);
      this.post.forEach(p => {

        p.htmlContent = this.preview.renderMarkdownWithMedia(p.content);// htmlContent;
      })
    })
  }
}
