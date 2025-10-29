import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../../models/post/postResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private newPostData = new BehaviorSubject<any>(null);
  private currentPostIdSubject = new BehaviorSubject<String>("");

  currentPostId$ = this.currentPostIdSubject.asObservable()
  private postToEdit: any = null;


  private postsSubject = new BehaviorSubject<PostResponse[]>([]);
  posts$ = this.postsSubject.asObservable();
  private commentSubject = new BehaviorSubject<PostResponse[]>([]);
  comment$ = this.commentSubject.asObservable();
  setPosts(posts: PostResponse[]) {
    this.postsSubject.next(posts);
  }

  removePost(postId: string) {
    const posts = this.postsSubject.getValue().filter(p => p.id !== postId);
    this.postsSubject.next(posts);
  }

  removeComment(commentid: string) {
    const posts = this.commentSubject.getValue().filter(p => p.id !== commentid);
    this.commentSubject.next(posts);
  }
  setCurrentPostId(id: string) {
    this.currentPostIdSubject.next(id);
  }


  newpost$ = this.newPostData.asObservable();
  setNewPost(post: any) {
    this.newPostData.next(post)
  }

  getCurrentPostId(): String {
    return this.currentPostIdSubject.value || localStorage.getItem('post-id');
  }
  editPost(post: PostResponse) {
    this.postToEdit = post;
  }
  notifyPostUpdated(updatedPost: PostResponse) {
    this.newPostData.next(updatedPost); // Notify home to update the post
  }
  getNewPost(): any {
    return this.newPostData;
  }
  getEditPost(): any {
    return this.postToEdit;
  }

  clear() {
    this.newPostData.next(null);
    this.postToEdit.next(null);
  }
}
