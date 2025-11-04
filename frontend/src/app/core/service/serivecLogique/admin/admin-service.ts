import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserResponseInAdmin } from "../../../models/admin/UserResponseInAdmin";
import { AdminService } from "../../servicesAPIREST/admin/admin-service";
import { NotificationService } from "../../notificationAlert/NotificationService";

@Injectable({
    providedIn: 'root'
})
export class AdminServiceShared {
    adminService = inject(AdminService);
    notificationAlert = inject(NotificationService);
    updateUser = new BehaviorSubject<UserResponseInAdmin | null>(null)
    checkDeleteUser = new BehaviorSubject<boolean>(false)
    update_user$ = this.updateUser.asObservable();
    check_delete_user$ = this.checkDeleteUser.asObservable();
    banUser(userId: string, days: number) {
        this.adminService.banUser(userId, days).subscribe({
            next: response => {
                this.updateUser.next(response.data)
            },
            error: error => {
                console.log(error, "error ");
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
}