import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';

@Component({
  selector: 'app-post-card',
  imports: [Materaile, PopUp],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  constructor(private auth: AuthService, private sharedService: SharedServicePost, private router: Router) { }
   apiUrl = apiUrl
  @Input() post: any;
  @Output() editPost = new EventEmitter<any>();
  show = false;
    
  isPostOwner(post: any): boolean {
     
    const check= post.uuid_user ===this.auth.getCurrentUserUUID();
    // console.log(post.uuid_user,"**", this.auth.getCurrentUserUUID());
    
    return check
  }

  get isOwner(): boolean {
    // console.log();
    
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
}
