import { Component } from '@angular/core';
import { LikesService } from '../../core/service/servicesAPIREST/like/likes-service';
import { PostResponse } from '../../core/models/post/postResponse';
import { Materaile } from '../../modules/materaile-module';
import { PopUp } from '../pop-up/pop-up';
import { likesServiceLogique } from '../../core/service/serivecLogique/like/likes-service-logique';
import { apiUrl } from '../../core/constant/constante';

@Component({
  selector: 'app-liked-posts',
  imports: [Materaile],//PopUp
  templateUrl: './liked-posts.html',
  styleUrl: './liked-posts.scss'
})
export class LikedPosts {
  constructor(private likedPost: LikesService, private like: likesServiceLogique) { }
  posts: PostResponse[] = [];
  apiUrl = apiUrl
  countPost = 0;
  ngOnInit() {
    this.likedPost.LikedPost().subscribe({
      next: response => {
        this.posts = response.data;
        this.countPost=this.posts.length
        console.log(this.posts);

      },
      error: error => {
        console.log(error);

      }
    })
  }
  toggleLikePost(postId: string, post: PostResponse) {
    this.like.toggleLikePost(postId, post);
  }

  popUp() { }
}
