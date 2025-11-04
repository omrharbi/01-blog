import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserResponseInAdmin } from "../../../models/admin/UserResponseInAdmin";
import { AdminService } from "../../servicesAPIREST/admin/admin-service";

@Injectable({
    providedIn: 'root'
})
export class AdminServiceShared {
    adminService = inject(AdminService);

    updateUser = new BehaviorSubject<UserResponseInAdmin | null>(null)
    update_user$ = this.updateUser.asObservable();
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
}