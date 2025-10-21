import { Injectable } from '@angular/core';

import { PostResponse } from '../../../models/post/postResponse';
import { LikesService } from '../../servicesAPIREST/like/likes-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class likesServiceLogique {
  constructor(private like: LikesService) { }
  // post?: PostResponse;
  // private postSubject = new BehaviorSubject<PostResponse>({} as PostResponse);
  // posts$ = this.postSubject.asObservable();


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
