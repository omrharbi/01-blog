import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { JwtService } from '../../core/service/JWT/jwt-service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';

import { CommentResponse } from '../../core/models/comment/CommentResponse';
import { Global } from '../../core/service/serivecLogique/globalEvent/global';

@Component({
  selector: 'app-pop-up',
  // imports: [Materaile],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  constructor(private auth: AuthService, private user: JwtService, private postService: PostService,
    private global: Global

  ) {
  }
  @Input() isOwner: boolean = false;
  @Input() isComment: boolean = false;
  isAuthenticated: boolean = false;
  uuid: string = "0";
  @Input() post!: PostResponse;
  @Input() comment!: CommentResponse;
  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
  isEdit: boolean = false;
  @Output() editPost = new EventEmitter<any>();

  onEdit() {
    if (this.isComment === true) {
      this.global.sharedData.emit({ type: 'comment', data: this.comment });
    } else {
      this.global.sharedData.emit({ type: 'post', data: this.post });
    }
  }

  onDelete() {
    if (this.isComment === true) {
      this.global.sharedData.emit({ type: 'Deletecomment', data: this.comment });
    } else {
      this.postService.DeletePost(this.post.id).subscribe({
        next: response => {
          console.log(response, "delete post");
        },
        error: error => {
          console.log(error, "****");
        }
      });
    }


  }
}
