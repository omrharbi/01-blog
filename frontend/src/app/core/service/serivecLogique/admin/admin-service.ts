import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { ReportPosts, UserResponseInAdmin } from "../../../models/admin/UserResponseInAdmin";
import { AdminService } from "../../servicesAPIREST/admin/admin-service";
import { NotificationService } from "../../notificationAlert/NotificationService";

@Injectable({
    providedIn: 'root'
})
export class AdminServiceShared {
    adminService = inject(AdminService);
    notificationAlert = inject(NotificationService);
    updateUser = new BehaviorSubject<UserResponseInAdmin | null>(null)
    updateUserReport = new BehaviorSubject<any>('')
    checkDeleteUser = new BehaviorSubject<boolean>(false)
    hiddenPost = new BehaviorSubject<any>([])
    update_user$ = this.updateUser.asObservable();
    update_user_report$ = this.updateUserReport.asObservable();
    hidden_post$ = this.hiddenPost.asObservable();
    checkDeletePosts = new BehaviorSubject<boolean>(false)

    check_delete_user$ = this.checkDeleteUser.asObservable();
    check_delete_post$ = this.checkDeletePosts.asObservable();



    banUser(userId: string, days: number) {
        this.adminService.banUser(userId, days).subscribe({
            next: response => { 
                this.updateUser.next(response.data)
                this.updateUserReport.next({ reportedUserId: userId, status: response.data?.status });
            },
            error: error => {
                const message = error?.error.error || "error "
                this.notificationAlert.showErrorWithoutRedirect(message)
                console.log(error);
            }
        })
    }

    changeRole(userId: string) {
        this.adminService.changeRole(userId).subscribe({
            next: response => {
                console.log(response);
                this.notificationAlert.showErrorWithoutRedirect(response?.message || "");
                this.updateUser.next(response.data)
            },
            error: error => {
                const message = error?.error.error || "error "
                this.notificationAlert.showErrorWithoutRedirect(message)
            }
        })
    }

    deleteUser(userId: string) {
        this.adminService.deleteUser(userId).subscribe({
            next: response => {
                console.log(response, "delete user ");

                this.checkDeleteUser.next(response.status || false)
            },
            error: error => {
                const message = error?.error.error || "error "
                this.notificationAlert.showErrorWithoutRedirect(message)
            }
        })
    }

    deletePosts(postId: string) {
        this.adminService.deletePost(postId).subscribe({
            next: response => {
                if (response.status) {
                    const post = document.getElementById(postId)
                    // console.log(post,"kljrjklwqrkghkrjhjkgrl");
                    if (post) {
                        post.remove();
                    }
                    this.checkDeletePosts.next(response.data || false)
                }
            },
            error: error => {
                const message = error?.error.error || "error "
                this.notificationAlert.showErrorWithoutRedirect(message)

            }
        })
    }

    HiddenPosts(postId: string) {
        this.adminService.hiddenPost(postId).subscribe({
            next: response => {
                if (response) {
                    this.hiddenPost.next(response.data);
                }
            },
            error: error => {
                const message = error?.error.error || "error "
                this.notificationAlert.showErrorWithoutRedirect(message)
            }
        });
    }
}