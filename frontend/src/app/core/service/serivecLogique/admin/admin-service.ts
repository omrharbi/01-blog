import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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
    update_user$ = this.updateUser.asObservable();
    update_user_report$ = this.updateUserReport.asObservable();
    checkDeletePosts = new BehaviorSubject<boolean>(false)

    check_delete_user$ = this.checkDeleteUser.asObservable();
    check_delete_post$ = this.checkDeletePosts.asObservable();



    banUser(userId: string, days: number) {
        this.adminService.banUser(userId, days).subscribe({
            next: response => {
                this.updateUser.next(response.data)
                this.updateUserReport.next({ reportedUserId: userId, status:response.data?.hidden });
            },
            error: error => {
                const message=error?.error.error || "error "
                this.notificationAlert.showErrorWithoutRedirect(message)
                console.log(error?.error.error, "error ");
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
                console.log(error, "error ");
            }
        })
    }

    deleteUser(userId: string) {
        this.adminService.deleteUser(userId).subscribe({
            next: response => {
                this.checkDeleteUser.next(response.status || false)
            },
            error: error => {
                console.log(error, "error ");

            }
        })
    }

    deletePosts(userId: string) {
        this.adminService.deletePost(userId).subscribe({
            next: response => {
                this.checkDeletePosts.next(response.status || false)
            },
            error: error => {
                console.log(error, "error ");

            }
        })
    }
}