import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class SharedServicePost {
  private newPostData = new BehaviorSubject<any>(null);
  newpost$ = this.newPostData.asObservable();
  setNewPost(post: any) {
    this.newPostData.next(post)
  }

  getNewPost(): any {
    return this.newPostData;
  }
  clear() {
    this.newPostData.next(null);
  }
}
