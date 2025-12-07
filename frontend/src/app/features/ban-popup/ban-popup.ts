import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { Materaile } from '../../modules/materaile-module';
import { ActionType } from '../../core/models/admin/UserResponseInAdmin';
import { AdminServiceShared } from '../../core/service/serivecLogique/admin/admin-service';
import { CommentService } from '../../core/service/servicesAPIREST/comment/comment-service';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ban-popup',
  imports: [Materaile],
  templateUrl: './ban-popup.html',
  styleUrl: './ban-popup.scss',
})
export class BanPopup {
  @Input() isVisible: boolean = false;
  @Input() userId: string = "";
  @Input() postId!: string;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();
  @Input() actionType!: ActionType;
  step: number = 1;
  banDays: number = 7;
  quickOptions: number[] = [1, 7, 14, 30, 90];
  adminService = inject(AdminServiceShared);
  commentService = inject(CommentService);
  postService = inject(PostService);
  toasterService = inject(ToastrService);


  @Input() targetId!: string;

  nextStep() {
    this.step = 2;
  }

  previousStep() {
    this.step = 1;
  }

  closePopup() {
    this.step = 1;
    this.banDays = 7;
    this.close.emit();
  }

  confirmBan() {
    this.confirm.emit(this.banDays);
    this.adminService.banUser(this.userId, this.banDays);
    this.closePopup();
  }

  deleteUser() {
    // 

    // this.adminService.deleteUser(this.userId);
    this.closePopup();
  }


  deletePostReport() {
    console.log(this.userId,"jhjkhjkhjlk");
    // this.adminService.deletePosts(this.userId);
    this.closePopup();
  }

  deletePost() {
    console.log("herre ", this.postId);
    // this.adminService.deleteUser(this.userId);
    // this.adminService.deletePosts(this.postId);
    this.closePopup();
  }

  hiddenPost() {
    this.adminService.HiddenPosts(this.userId);
    this.closePopup();
  }
  deleteItem() {
    console.log("delete itim", this.actionType);

    if (this.actionType === 'comment') {
      this.commentService.delete(this.targetId).subscribe({
        next: res => {
          if (res.status) {

            const postDiv = document.getElementById(this.targetId)
            if (postDiv) {
              this.toasterService.success("Delete Post  Success");
              postDiv?.remove()
            }
          } else {
            this.toasterService.error("Error To delete");
          }
        }
      });
    }

    if (this.actionType === 'post') {
      console.log("here 123");

      this.postService.DeletePost(this.targetId).subscribe({
        next: response => {
          if (response.status) {

            const postDiv = document.getElementById(this.targetId)
            if (postDiv) {
              this.toasterService.success("Delete Post  Success");
              postDiv?.remove()
            }
          } else {
            this.toasterService.error("Error To delete");
          }
        },
        error: error => {
          this.toasterService.error("Error To delete");
          console.log(error, "****");
        }
      });
    }


    // if (this.actionType === 'delete-post-report') {
    //   console.log("here 12");

    //   // this.adminService.deletePosts(this.targetId)
    // }

    this.closePopup();
  }

  changeRole() {
    this.adminService.changeRole(this.userId);
    this.closePopup();
  }
  onOverlayClick(event: MouseEvent) {
    this.closePopup();
  }
}
