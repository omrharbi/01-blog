import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  imports: [Materaile,PopUp],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  constructor(private sharedService: SharedServicePost,private router:Router) { }
  
  apiUrl = apiUrl
  @Input() post: any;
  @Output() editPost = new EventEmitter<any>();

  show = false;
  popUp() {
    this.show = !this.show;
    this.editPost.emit(this.post);
    console.log("hwwe",this.show);
  }

  onEditPost(post: PostResponse) {
    console.log("Editing post:", post);
 
    this.sharedService.editPost(post); 
    this.router.navigate(['/create']);
  }
}
