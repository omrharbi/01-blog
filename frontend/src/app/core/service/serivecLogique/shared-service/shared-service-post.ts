import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../../models/post/postResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedServicePost {
  private newPostData = new BehaviorSubject<any>(null);
 
  private postToEdit: any = null;
  newpost$ = this.newPostData.asObservable();
   setNewPost(post: any) {
    this.newPostData.next(post)
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
