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
import { apiUrl } from '../../core/constant/constante';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { PopUp } from '../pop-up/pop-up';
import { Global } from '../../core/service/serivecLogique/globalEvent/global';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';

@Component({
  selector: 'app-comment',
  imports: [Materaile, TimeAgoPipe, PopUp],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment {
  @Input() post!: PostResponse;

  constructor(private commentService: CommentService, private like: likesServiceLogique,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
    , 
    private global: Global
  ) { }
  commentResponse?: CommentResponse;
  getAllComment: CommentResponse[] = [];
  content: string = "";
  postId: string = "";
  addComment: CommentRequest = {
    content: "",
    postId: ""
  };
  apiUrl = apiUrl;
  show: boolean = false;
  @Input() comments?: CommentResponse;
  isEdit = false
  idComment = "";

  showPopUp: { [commentId: string]: boolean } = {};
  ngOnInit() {
    this.global.sharedData.subscribe((event) => {
      if (event.type === 'comment') {
        console.log('Editing comment:', event.data);
        this.idComment = event.data.id
        this.content = event.data.content;
        this.isEdit = true;
      }

      if (event.type === 'Deletecomment') {
        console.log('Deletecomment comment:', event.data);
        this.delete(event.data.id)
      }
    })
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.getComments()
  }


  submitComment(id: string) {
    if (this.isEdit) {
      this.EditComment(id)
    } else {
      this.addComment.content = this.content;
      this.addComment.postId = id;
      this.commentService.AddComment(this.addComment).subscribe({
        next: response => {
          this.commentResponse = response.data;
          this.getAllComment.unshift(response.data)
          this.content = "";
        },
        error: error => {
          console.log("Error To Add Comment ", error);

        }
      })
    }
  }

  get isOwner(): boolean {
    return this.isPostOwner(this.post);
  }

  get isComment(): boolean {
    return true
  }

  isPostOwner(comment: any): boolean {
    const check = comment.uuid_user === this.auth.getCurrentUserUUID();
    return check
  }
  getComments() {

    this.commentService.getComments(this.postId).subscribe({
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
  }
  OnPopUp(isInside: boolean, commentId: string) {
    if (isInside) {
      this.showPopUp[commentId] = !this.showPopUp[commentId];

    } else {
      this.showPopUp[commentId] = false

    }
  }
  delete(id: string) {
    this.commentService.delete(id).subscribe({
      next: response => {
        if (response.status) {
          this.removeComment(id);
          console.log("delete it ");
        }
      },
      error: error => {
        console.log(error);

      }
    })
  }

  removeComment(commentid: string) {
    const posts = this.getAllComment.filter(p => p.id !== commentid);
    this.getAllComment = [...posts]
    // this.commentSubject.next(posts);
  }
  EditComment(id: string) {


    const idComment = this.idComment;
    this.addComment.content = this.content;
    this.addComment.postId = id;
    this.commentService.editComment(idComment, this.addComment).subscribe({
      next: response => {
        if (response.status) {
          const index = this.getAllComment.findIndex(c => c.id === this.idComment);
          if (index !== -1) {
            this.getAllComment[index].content = response.data.content; // update only content
          }

          // reset edit mode
          this.isEdit = false;
          this.idComment = "";
          this.content = '';
        }
      },
      error: error => {
        console.log(error);

      }
    })
  }
}
