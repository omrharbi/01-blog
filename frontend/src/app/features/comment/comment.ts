import { Component, Input, SimpleChanges } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { CommentService } from '../../core/service/servicesAPIREST/comment/comment-service';
import { CommentResponse } from '../../core/models/comment/CommentResponse';
import { CommentRequest } from '../../core/models/comment/commentRequest';
import { Materaile } from '../../modules/materaile-module';

@Component({
  selector: 'app-comment',
  imports: [Materaile],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment {
  @Input() post!: PostResponse;

  constructor(private comment: CommentService) { }
  commentResponse?: CommentResponse;
  getAllComment: CommentResponse[] = [];
  content: string = "";
  postId: string = "";
  addComment: CommentRequest = {
    content: "",
    postId: ""
  };

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(this.post.avater_user);
    
  //   // this.getComments();
  // }
  AddComment(id: string) {

    this.addComment.content = this.content;
    this.addComment.postId = id;
    console.log(this.addComment);
    this.comment.AddComment(this.addComment).subscribe({
      next: response => {
        this.commentResponse = response.data;
      },
      error: error => {
        console.log("Error To Add Comment ", error);

      }
    })
  }


  getComments(id:string) {
    this.comment.getComments(id).subscribe({
      next: response => {
        this.getAllComment = response.data;
        console.log(this.getAllComment);

      },
      error: error => {
        console.log("Error to get comment ", error);

      }
    })
  }
}
