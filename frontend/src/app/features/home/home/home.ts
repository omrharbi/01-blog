import { Component, Input } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare, PostCard, Materaile],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  posts: PostResponse[] = [];
  // post: PostResponse =  null;
  constructor(private postservice: PostService, private postDatashard: SharedServicePost) {

  }

  onEditPost(post: PostResponse) {
    this.postDatashard.editPost(post);
  }
  ngOnInit() {
    console.log('Token in localStorage:', localStorage.getItem('USER_TOKEN'));
    this.postservice.getAllPost().subscribe(res => {
      console.log("get all posts ", res.data);
      this.posts = res.data;
    });

    // listen for new post coming from create page
    this.postDatashard.newpost$.subscribe(post => {
      if (post) {
        this.updatePostInList(post);
       }
    });

    console.log("get all posts ", this.posts);

  }

  private updatePostInList(updatedPost: PostResponse) {
    const index = this.posts.findIndex(p => p._id === updatedPost._id);
    if (index !== -1) {
      // Update existing post
      this.posts[index] = updatedPost;
    } else {
      // Add new post to top
      this.posts.unshift(updatedPost);
    }
    this.posts = [...this.posts]; // Trigger change detection
  }
}
