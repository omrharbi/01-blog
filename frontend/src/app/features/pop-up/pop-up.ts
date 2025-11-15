import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { JwtService } from '../../core/service/JWT/jwt-service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';

import { CommentResponse } from '../../core/models/comment/CommentResponse';
import { Global } from '../../core/service/serivecLogique/globalEvent/global';
import { SharedService } from '../../core/service/serivecLogique/shared-service/shared-service-post';
import { Materaile } from '../../modules/materaile-module';
import { ReportService } from '../../core/service/servicesAPIREST/report/report-service';
import { NotificationService } from '../../core/service/notificationAlert/NotificationService';
import { PopUpReport } from './pop-up-report/pop-up-report';
import { CommentService } from '../../core/service/servicesAPIREST/comment/comment-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pop-up',
  // imports: [Materaile],
  standalone: true,
  imports: [CommonModule, Materaile, PopUpReport],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {

  constructor(private auth: AuthService, private toasterService: ToastrService, private user: JwtService, private postService: PostService, private commentService: CommentService,
    private global: Global
  ) {
  }
  @Input() isOwner: boolean = false;
  @Input() isComment: boolean = false;
  isAuthenticated: boolean = false;
  uuid: string = "0";
  @Input() post!: PostResponse;
  @Input() comment!: CommentResponse;
  selectedReason: string = '';
  reportDetails: string = '';
  isVisible = false

  reportReasons = [
    'SPAM',
    'HARASSMENT',
    'HATE_SPEECH',
    'VIOLENCE',
    'MISINFORMATION',
    'OTHER'
  ];

  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
  isEdit: boolean = false;
  @Output() editPost = new EventEmitter<any>();
  @Output() clickedInside = new EventEmitter<boolean>();
  notificationAlert = inject(NotificationService)
  onEdit() {
    if (this.isComment === true) {
      this.global.sharedData.emit({ type: 'comment', data: this.comment });
    } else {
      this.global.sharedData.emit({ type: 'post', data: this.post });
    }
  }

  onDelete() {
    if (this.isComment === true) {

      this.commentService.delete(this.comment.id).subscribe({
        next: response => {
          if (response.status) {
            const postDiv = document.getElementById(this.comment.id)
            if (postDiv) {
              this.toasterService.success("Delete Comment  Success");
              postDiv?.remove()
            }
          }
        },
        error: error => {
          console.log(error);

        }
      })

      console.log();



    } else {
      this.postService.DeletePost(this.post.id).subscribe({
        next: response => {
          if (response.status) {

            const postDiv = document.getElementById(this.post.id)
            if (postDiv) {
              this.toasterService.success("Delete Post  Success");
              postDiv?.remove()
            }
          }
        },
        error: error => {
          console.log(error, "****");
        }
      });
    }
  }

  report() {
    this.isVisible = true
  }

  onReasonChange() {
    if (this.selectedReason !== 'OTHER') {
      this.reportDetails = '';
    }
  }

  formatReasonLabel(reason: string): string {
    return reason.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

}
