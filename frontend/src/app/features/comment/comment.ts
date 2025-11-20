import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { CommentService } from '../../core/service/servicesAPIREST/comment/comment-service';
import { CommentResponse } from '../../core/models/comment/CommentResponse';
import { CommentRequest } from '../../core/models/comment/commentRequest';
import { Materaile } from '../../modules/materaile-module';
import { SharedService } from '../../core/service/serivecLogique/shared-service/shared-service-post';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscriber, Subscription } from 'rxjs';
import { Login } from '../auth/login/login';
import { likesServiceLogique } from '../../core/service/serivecLogique/like/likes-service-logique';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { apiUrl, token } from '../../core/constant/constante';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { PopUp } from '../pop-up/pop-up';
import { Global } from '../../core/service/serivecLogique/globalEvent/global';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';
import { SharedServicePopUp } from '../../core/service/serivecLogique/SharedServicePopUp/shared-service-popup';
import { JwtService } from '../../core/service/JWT/jwt-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment',
  imports: [Materaile, TimeAgoPipe, PopUp],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment {
  @Input() post!: PostResponse;

  constructor(private commentService: CommentService, private like: likesServiceLogique,
    private route: ActivatedRoute,
    private jwtService: AuthService,
    private global: Global,
    private servicePopUp: SharedServicePopUp,
    private auth: AuthService,

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
  @Input() comment?: CommentResponse;
  isEdit = false
  idComment = "";
  // isOwner: boolean = false;
  isAuthenticated: boolean = false;
  userId = signal<string | null>(null);
  countComment = signal(0);

  showPopUp: { [commentId: string]: boolean } = {};
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    this.userId.set(this.auth.getCurrentUserUUID() || null);

    this.global.sharedData.subscribe((event) => {
      if (event.type === 'comment') {
        this.idComment = event.data.id
        this.content = event.data.content;
        this.isEdit = true;
      }


    })

    this.servicePopUp.popService$.subscribe(commentId => {
      if (this.getAllComment !== null) {
        this.getAllComment.filter(comment => {
          this.showPopUp[comment.id] = comment.id === commentId;
        })
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
          this.getAllComment = this.getAllComment || [];
          this.getAllComment.unshift(response.data)
          this.countComment.update(n => n + 1);
          this.content = "";
        },
        error: error => {
          console.log("Error To Add Comment ", error);
        }
      })
    }
  }


  get isComment(): boolean {
    return true
  }
  isPostOwner(comment: any): boolean {
    const check = comment.userId === this.jwtService.getCurrentUserUUID();
    return check
  }
  isOwner(comment: any): boolean {
    return this.isPostOwner(comment);
  }
  getComments() {
    // console.log(this.comment.userId, "");

    this.commentService.getComments(this.userId(), this.postId).subscribe({
      next: response => {
        if (response.status) {
          this.countComment.set(response.data.length);
          this.getAllComment = response.data;
        }
      },
      error: error => {
        console.log("Error to get comment ", error);

      }
    })
  }

  toggleLikePost(commentId: string, comment: CommentResponse) {
    this.like.toggleLikeComment(commentId, comment);
  }
  OnPopUp(isInside: boolean, commentId: string, comment: CommentResponse) {
    if (isInside) {
      this.servicePopUp.onPopUp(commentId)
    } else {
      this.servicePopUp.closeAllPopups()

    }
  }
  EditComment(id: string) {


    const idComment = this.idComment;
    this.addComment.content = this.content;
    this.addComment.postId = id;
    this.commentService.editComment(idComment, this.addComment).subscribe({
      next: response => {
        if (response.status && this.getAllComment !== null) {
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
