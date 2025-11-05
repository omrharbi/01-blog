import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PostResponse } from '../../core/models/post/postResponse';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { JwtService } from '../../core/service/JWT/jwt-service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';

import { CommentResponse } from '../../core/models/comment/CommentResponse';
import { Global } from '../../core/service/serivecLogique/globalEvent/global';
import { SharedService } from '../../core/service/serivecLogique/shared-service/shared-service-post';
import { flatMap } from 'rxjs';
import { Materaile } from '../../modules/materaile-module';

@Component({
  selector: 'app-pop-up',
  // imports: [Materaile],
  standalone: true,
  imports: [CommonModule, Materaile],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.scss'
})
export class PopUp {
  constructor(private auth: AuthService, private user: JwtService, private postService: PostService,
    private global: Global
    , private sharedService: SharedService
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
  isVisible = signal(false)
  isEdit: boolean = false;
  @Output() editPost = new EventEmitter<any>();
  @Output() clickedInside = new EventEmitter<boolean>();
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
          if (response.status) {

            this.sharedService.removePost(this.post.id);
          }
          // console.log(response, "delete post");
        },
        error: error => {
          console.log(error, "****");
        }
      });
    }
  }


  
  report() {
    this.isVisible.set(true)
    console.log(this.isVisible());
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

  submitReport() {
    if (!this.selectedReason) return;

    if (this.selectedReason === 'OTHER' && !this.reportDetails?.trim()) {
      return;
    }

    const report = {
      reason: this.selectedReason,
      details: this.selectedReason === 'OTHER' ? this.reportDetails : null,
      timestamp: new Date()
    };

    // TODO: Send report to your backend
    console.log('Report submitted:', report);

    this.closePopup();
  }

  closePopup() {
    this.isVisible.set(false);
    this.selectedReason = '';
    this.reportDetails = '';
  }

  onOverlayClick(event: Event) {
    this.closePopup();
  }

}
