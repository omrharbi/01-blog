import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../../models/postData/postResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedServicePost {
  private newPostData = new BehaviorSubject<any>(null);
  private editPostSubject = new BehaviorSubject<PostResponse | null>(null);


  newpost$ = this.newPostData.asObservable();
  editpost$ = this.editPostSubject.asObservable();
  setNewPost(post: any) {
    this.newPostData.next(post)
  }
  editPost(post: PostResponse) {
    this.editPostSubject.next(post);
  }
  notifyPostUpdated(updatedPost: PostResponse) {
    this.newPostData.next(updatedPost); // Notify home to update the post
  }
  getNewPost(): any {
    return this.newPostData;
  }
  clear() {
    this.newPostData.next(null);
    this.editPostSubject.next(null);

  }
}
