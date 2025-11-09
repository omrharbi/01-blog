import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PostResponse } from '../../../core/models/post/postResponse';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { JwtService } from '../../../core/service/JWT/jwt-service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';

import { CommentResponse } from '../../../core/models/comment/CommentResponse';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { SharedService } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { flatMap } from 'rxjs';
import { Materaile } from '../../../modules/materaile-module';
import { ReportService } from '../../../core/service/servicesAPIREST/report/report-service';
import { NotificationService } from '../../../core/service/notificationAlert/NotificationService';
import { UserProfile } from '../../../core/models/user/userProfileResponse';

@Component({
  selector: 'app-pop-up-report',
  // imports: [Materaile],
  standalone: true,
  imports: [CommonModule, Materaile],
  templateUrl: './pop-up-report.html',
  styleUrl: './pop-up-report.scss'
})
export class PopUpReport {
  constructor(private auth: AuthService, private user: JwtService, private postService: PostService,
    private global: Global
    , private sharedService: SharedService,
    private reporting: ReportService
  ) {
  }
  @Input() isOwner: boolean = false;
  @Input() isComment: boolean = false;
  isAuthenticated: boolean = false;
  uuid: string = "0";
  @Input() post!: PostResponse;
  @Input() comment!: CommentResponse;
  @Input() userProfile!: UserProfile;
  selectedReason: string = '';
  reportDetails: string = '';
  @Input() showpPopUp = false;
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
  notificationAlert = inject(NotificationService)

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
    // console.log(this.userProfile ? this.userProfile.id : null, "user ");

    const report = {
      reasons: this.selectedReason,
      details: this.selectedReason === 'OTHER' ? this.reportDetails : null,
      postReportId: this.post ? this.post.id : null,
      commentReportId: this.comment ? this.comment.id : null,
      userReportId: this.userProfile ? this.userProfile.id : null,
      timestamp: new Date()
    };
    if (this.userProfile !== undefined && this.userProfile.id !== null) {

      this.reporting.reportUser(report).subscribe({
        next: response => {
          console.log(response.message, "response message ");
          this.notificationAlert.showSuccess(response.message || "Report could not be submitted", "Report Post");

        },
        error: error => {
          const message =
            error?.error?.error ||
            error?.error?.message ||
            'Something went wrong. Please try again.'
          this.notificationAlert.showErrorWithoutRedirect(message);
          console.log(error);

        }
      })
    } else {

      this.reporting.reportPosts(report).subscribe({
        next: response => {
          console.log(response.message, "response ");
          this.notificationAlert.showSuccess(response.message || "Report could not be submitted", "Report Post");


        },
        error: error => {
          const message =
            error?.error?.error ||
            error?.error?.message ||
            'Something went wrong. Please try again.'
          this.notificationAlert.showErrorWithoutRedirect(message);
          console.log(error);

        }
      })
    }
    this.closePopup();
  }

  closePopup() {
    this.selectedReason = '';
    this.reportDetails = '';
    this.showpPopUp = false;
    console.log("close ");

  }

  onOverlayClick(event: Event) {
    this.closePopup();
  }

}
