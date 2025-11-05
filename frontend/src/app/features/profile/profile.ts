import { Component, signal } from '@angular/core';
import { EditProfile } from './edit-profile/edit-profile';
import { Materaile } from '../../modules/materaile-module';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { ProfileService } from '../../core/service/servicesAPIREST/profile/profile-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { PostResponse } from '../../core/models/post/postResponse';
import { UploadImage } from '../../core/service/serivecLogique/upload-images/upload-image';
import { PreviewService } from '../../core/service/serivecLogique/preview/preview.service';
import { apiUrl } from '../../core/constant/constante';
import { likesServiceLogique } from '../../core/service/serivecLogique/like/likes-service-logique';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../core/service/notificationAlert/NotificationService';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { use } from 'marked';

@Component({
  selector: 'app-profile',
  imports: [EditProfile, Materaile, TimeAgoPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(
    private like: likesServiceLogique,
    private route: ActivatedRoute,
    private auth: AuthService,
    private profile: ProfileService,
    private replceimge: UploadImage,
    private preview: PreviewService,
    private showMessage: NotificationService,
    private following: FollowingService
  ) { }
  isAuthenticated: boolean = false;
  editProfile = false;
  userProfile: UserProfile = {
    id: '',
    firstname: '',
    lastname: '',
    about: '',
    username: '',
    avatar: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    followingMe: false,
    skills: [],
    createdAt: ""
  };

  apiUrl = apiUrl;
  countPost = 0;
  post: PostResponse[] = [];
  isFollowing: boolean = false;
  username = signal("")
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  loading = false;
  EditProfile() {
    this.editProfile = !this.editProfile;
  }

  isPostOwner(usernameID: any): boolean {
    const check = usernameID === this.auth.getCurrentUserUUID();
    console.log(check);
    return check;
  }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username') || '';
    this.username.set(username);
    this.isAuthenticated = this.auth.isLoggedIn();
    this.profile.profile(username).subscribe({
      next: (respone) => {
        this.userProfile = respone.data;
        // if (respone.status === false && respone.error != null) {
        //   // this.showMessage.showError(respone.error, false);
        // }
      },
      error: (error) => {
        console.log(error, 'error herr ');
      },
    });
    const page = 0;
    const size = 3;
    this.loadingPosts(username);

  }
  loadingPosts(username: string) {
    if (this.loading || (this.totalPages && this.currentPage >= this.totalPages)) return;
    this.loading = true;
    this.profile.GetMyPosts(username, 0, this.pageSize).subscribe((res) => {
      this.post = res.data?.content || [];
      this.currentPage = res.data.number;
      this.totalPages = res.data.totalPages;
      this.loading = false;
      this.post.forEach((p) => {
        p.htmlContent = this.preview.renderMarkdownWithMedia(p.content); // htmlContent;
      });
    });
  }


  loadMorePosts() {
    if (this.loading || this.currentPage >= this.totalPages - 1) {
      return;
    }

    this.loading = true;
    const nextPage = this.currentPage + 1;
    this.profile.GetMyPosts(this.username(), nextPage, this.pageSize).subscribe({
      next: response => {
        if (response.data && response.data.content) {
          this.post = [...this.post, ...response.data.content];
          this.currentPage = response.data.number;
          this.totalPages = response.data.totalPages;
        }
        this.loading = false;
      },
      error: error => {
        console.error('Error loading more posts:', error);
        this.loading = false;
      }
    });

  }
  hasMorePosts(): boolean {
    return this.currentPage < this.totalPages - 1;
  }



  followUser(id: string) {
    console.log(id);
    this.following.followUser(id).subscribe({
      next: (res) => {
        if (res.status) {
          this.isFollowing = res.status;
        }
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  Unfollow(id: string) {
    this.following.unfollow(id).subscribe({
      next: (res) => {
        if (res.status) {
          this.isFollowing = res.status;
        }
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  toggleFollow(userId: string) {
    if (this.isFollowing) {
      this.Unfollow(userId);
    } else {
      // this.followUser(userId);
    }
    // Toggle the state
    this.isFollowing = !this.isFollowing;
  }
  toggleLikePost(postId: string, post: PostResponse) {
    this.like.toggleLikePost(postId, post);
  }
}
