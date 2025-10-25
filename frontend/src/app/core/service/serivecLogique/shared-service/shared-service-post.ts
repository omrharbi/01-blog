import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../../models/post/postResponse';

@Injectable({
  providedIn: 'root'
})
export class SharedServicePost {
  private newPostData = new BehaviorSubject<any>(null);
  private currentPostIdSubject = new BehaviorSubject<String>("");

  currentPostId$ = this.currentPostIdSubject.asObservable()
  private postToEdit: any = null;

  setCurrentPostId(id: string) {
    this.currentPostIdSubject.next(id);
  }


  newpost$ = this.newPostData.asObservable();
  setNewPost(post: any) {
    this.newPostData.next(post)
  }

  // deletePostLocally(postId: string) {
  //   const currentPost=this.newPostData.value;
  //   if (currentPost){
  //     const updatePosts=currentPost.filter((p:any)=>p.id!==postId);
  //     this.newPostData.next(updatePosts);
  //   }
  // }
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
