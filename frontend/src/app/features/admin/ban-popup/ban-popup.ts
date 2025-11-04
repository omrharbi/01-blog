import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { ActionType } from '../../../core/models/admin/UserResponseInAdmin';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';

@Component({
  selector: 'app-ban-popup',
  imports: [Materaile],
  templateUrl: './ban-popup.html',
  styleUrl: './ban-popup.scss',
})
export class BanPopup {
  @Input() isVisible: boolean = false;
  @Input() userId: string = "";
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();
  @Input() actionType: ActionType = 'ban';
  step: number = 1;
  banDays: number = 7;
  quickOptions: number[] = [1, 7, 14, 30, 90];
  adminService = inject(AdminService);
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
    // console.log(this.banDays, "days", this.userId, "user id ");
    this.adminService.banUser(this.userId, this.banDays).subscribe({
      next: response => {
        console.log(response, "response ban user");
      },
      error: error => {
        console.log(error, "error ");

      }
    })
    this.closePopup();
  }

  onOverlayClick(event: MouseEvent) {
    this.closePopup();
  }
}
