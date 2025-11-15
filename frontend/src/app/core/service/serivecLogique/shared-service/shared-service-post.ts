import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../../models/post/postResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private newPostData = new BehaviorSubject<any>(null);
  private countPostSubject = new BehaviorSubject<number>(0);
  private currentPostIdSubject = new BehaviorSubject<String>("");

  currentPostId$ = this.currentPostIdSubject.asObservable()
  countPost$ = this.countPostSubject.asObservable()
  private postToEdit: any = null;


  private postsSubject = new BehaviorSubject<PostResponse[]>([]);
  posts$ = this.postsSubject.asObservable();
  private commentSubject = new BehaviorSubject<PostResponse[]>([]);
  comment$ = this.commentSubject.asObservable();


  setPosts(posts: PostResponse[]) {
    this.postsSubject.next(posts);
    this.countPostSubject.next(posts.length)
  }

  setCurrentPostId(id: string) {
    this.currentPostIdSubject.next(id);
  }
  newpost$ = this.newPostData.asObservable();
  setNewPost(post: any) {
    this.newPostData.next(post)
  }

  editPost(post: PostResponse) {
    this.postToEdit = post;
  }

  getEditPost(): any {
    return this.postToEdit;
  }

}
