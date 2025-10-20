import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';
import { PostResponse } from '../../../core/models/post/postResponse';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { LikesService } from '../../../core/service/servicesAPIREST/like/likes-service';
import { likeResponse } from '../../../core/models/like/likeResponse';

@Component({
  selector: 'app-post-card',
  imports: [Materaile, PopUp],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  constructor(private auth: AuthService, private sharedService: SharedServicePost, private router: Router

    , private like: LikesService
  ) { }
  apiUrl = apiUrl
  isLiked: likeResponse = {
    isLiked: false
  };
  @Input() post: any;
  @Output() editPost = new EventEmitter<any>();
  show = false;

  isPostOwner(post: any): boolean {
    const check = post.uuid_user === this.auth.getCurrentUserUUID();
    return check
  }

  get isOwner(): boolean {
    return this.isPostOwner(this.post);
  }


  popUp() {
    this.isPostOwner(this.post);
    this.show = !this.show;
    this.editPost.emit({ post: this.post });
  }

  onEditPost(post: any) {
    this.sharedService.editPost(post);
    this.router.navigate(['/edit'], { queryParams: { edit: true } });
  }

  toggleLikePost(id: string) {
    this.like.toggleLikePost(id).subscribe({
      next: response => {
        // console.log(response);
        this.isLiked.isLiked = response.status
        // console.log();
        
      },
      error: error => {
        console.log(error);

      }
    })

  }
}
