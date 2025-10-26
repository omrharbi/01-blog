import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationDialog } from "../../../shared/components/notification-dialog/notification-dialog";
import { Router } from "@angular/router";
import { AuthService } from "../servicesAPIREST/auth/auth-service";

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    constructor(private dialog: MatDialog, private router: Router,
         private authService: AuthService) { }

    showError(message: string, redirectToLogin: boolean = false) {
        const dialogRef = this.dialog.open(NotificationDialog, {
            width: '400px',
            disableClose: true,
            data: { message },
            panelClass: 'center-dialog'
        });
        dialogRef.afterClosed().subscribe(() => {
            if (redirectToLogin) {
                this.authService.logout();
                this.router.navigate(['/login']);
            }else{
                 this.router.navigate(['/']);
            }
        });

    }


    
    showSuccess(message: string, title: string = 'Success') {
        this.dialog.open(NotificationDialog, {
            width: '400px',
            panelClass: 'center-dialog',
            disableClose: true,
            data: { title, message }
        });
    }
}