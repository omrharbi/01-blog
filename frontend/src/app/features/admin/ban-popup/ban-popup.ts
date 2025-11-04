import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { ActionType, UserResponseInAdmin } from '../../../core/models/admin/UserResponseInAdmin';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminServiceShared } from '../../../core/service/serivecLogique/admin/admin-service';

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
  adminService = inject(AdminServiceShared);
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
    this.adminService.deleteUser(this.userId);
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
