import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../models/postData/postResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedServicePost {
  private newPostData = new BehaviorSubject<any>(null);
  newpost$ = this.newPostData.asObservable();
  setNewPost(post: any) {
    this.newPostData.next(post)
  }
  clear() {
    this.newPostData.next(null);
  }
}
