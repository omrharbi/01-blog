import { Component, Input, SimpleChanges } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { CommentService } from '../../core/service/servicesAPIREST/comment/comment-service';
import { CommentResponse } from '../../core/models/comment/CommentResponse';
import { CommentRequest } from '../../core/models/comment/commentRequest';
import { Materaile } from '../../modules/materaile-module';
import { SharedServicePost } from '../../core/service/serivecLogique/shared-service/shared-service-post';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscriber, Subscription } from 'rxjs';
import { Login } from '../auth/login/login';
import { likesServiceLogique } from '../../core/service/serivecLogique/like/likes-service-logique';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-comment',
  imports: [Materaile, TimeAgoPipe],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment {
  @Input() post!: PostResponse;

  constructor(private comment: CommentService,private like: likesServiceLogique, 

    private route: ActivatedRoute,
    private router: Router
  ) { }
  commentResponse?: CommentResponse;
  getAllComment: CommentResponse[] = [];
  content: string = "";
  postId: string = "";
   addComment: CommentRequest = {
    content: "",
    postId: ""
  };


  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.getComments()
  }
  AddComment(id: string) {

    this.addComment.content = this.content;
    this.addComment.postId = id;
    // console.log(this.addComment);
    this.comment.AddComment(this.addComment).subscribe({
      next: response => {
        this.commentResponse = response.data;
        this.getAllComment.unshift(response.data)
        this.content="";
      },
      error: error => {
        console.log("Error To Add Comment ", error);

      }
    })
  }


  getComments() {

    this.comment.getComments(this.postId).subscribe({
      next: response => {
        this.getAllComment = response.data;
        console.log(this.getAllComment, "***********");
      },
      error: error => {
        console.log("Error to get comment ", error);

      }
    })
  }

  toggleLikePost(commentId: string, comment: CommentResponse) {
    this.like.toggleLikeComment(commentId, comment);
    // this.cdr.detectChanges();
  }
}
