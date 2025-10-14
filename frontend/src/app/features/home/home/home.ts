import { Component, Input } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { Route, Router } from '@angular/router';
import { use } from 'marked';

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


  }

  private updatePostInList(updatedPost: PostResponse) {
    this.posts.unshift(updatedPost);
    this.posts = [...this.posts]; // Trigger change detection
  }
}
