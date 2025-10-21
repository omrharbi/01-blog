 import { Injectable } from '@angular/core';
 
import { PostResponse } from '../../../models/post/postResponse';
import { LikesService } from '../../servicesAPIREST/like/likes-service';

@Injectable({
  providedIn: 'root'
})
export class likesServiceLogique {
  constructor(  private like: LikesService) { }

  toggleLikePost(postId: string, post: PostResponse) {
    const previousLiked = post.liked;
    post.liked = !post.liked;
    post.likesCount += post.liked ? 1 : -1;

    this.like.toggleLikePost(postId).subscribe({
      next: (response) => {
        if (response.data.isLiked != null) {
          post.liked = response.data.isLiked;
          post.likesCount = response.data.countLike;
        }
      },
      error: (err) => {
        console.log(err, "*** ", previousLiked);
      }
    });
  }



}
