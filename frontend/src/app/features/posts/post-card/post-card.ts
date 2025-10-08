import { Component, Input, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { PostResponse } from '../../../core/models/postData/postResponse';

@Component({
  selector: 'app-post-card',
  imports: [Materaile],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
 @Input() post: any;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['post']) {
      console.log('Post input changed:', changes['post'].currentValue);
    }
  }
  // onPostCreated(post: PostResponse) {
  //   console.log("New post received:", post);
  //   this.posts.unshift(post); // Add new post to top of list
  // }
}
