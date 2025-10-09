import { Component, Input, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { PostService } from '../../../core/service/create-posts/post-service';
import { SharedServicePost } from '../../../core/service/shared-service/shared-service-post';
 
@Component({
  selector: 'app-post-card',
  imports: [Materaile],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
 @Input() post: any;
  //  constructor(private postservice: PostService, private postDatashard: SharedServicePost) {
 
  //  }
  // ngOnChanges(changes: SimpleChanges) {
  //   // console.log("**------------------");
  //   console.log('Post input changed',this.postDatashard.getNewPost());
    
  //   if (changes['post']) {
  //   }
  // }
  // onPostCreated(post: PostResponse) {
  //   console.log("New post received:", post);
  //   this.posts.unshift(post); // Add new post to top of list
  // }
}
