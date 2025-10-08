import { Component, Input } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { PostService } from '../../../core/service/create-posts/post-service';
import { SharedServicePost } from '../../../core/service/shared-service/shared-service-post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare, PostCard, Materaile],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  posts: any[] = [];
  constructor(private postservice: PostService, private postDatashard: SharedServicePost) {

  }
  ngOnInit() {
    // load existing posts
    // this.postService.getPosts().subscribe(res => {
    //   this.posts = res.data;
    // });

    // listen for new post coming from create page
    this.postDatashard.newpost$.subscribe(post => {
      if (post) {
        this.posts.unshift(post);  // add to top
        this.postDatashard.clear(); // clear after using
      }
    });
  }
}
