import { Component, EventEmitter, input, signal } from '@angular/core';
import { ActionType, UserResponseInAdmin } from '../../../core/models/admin/UserResponseInAdmin';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { Materaile } from '../../../modules/materaile-module';
import { BanPopup } from '../ban-popup/ban-popup';

@Component({
  selector: 'app-users-management',
  imports: [Materaile, BanPopup],
  templateUrl: './users-management.html',
  styleUrl: './users-management.scss',
})
export class UsersManagement {
  showBanPopup = false;
  constructor(private admin: AdminService) { }
  allUsers = signal<UserResponseInAdmin[]>([]);
  actionType = signal<ActionType>('ban')
  userId = signal<string>("")
  ngOnInit() {
    let page = 0;
    let size = 10;
    this.admin.getAllUsers(page, size).subscribe({
      next: (response: any) => {
        this.allUsers.set(response?.data?.content || []);
        console.log("admin test", this.allUsers());
      }
    })
  }
  banUser(users: any) {
    console.log(users, "click ");

  }
  unbanUser(users: any) { }
  handleBan(days: number) {
    // console.log(`User banned for ${days} days`);
    // Add your ban logic here
  }

  actionTypeHandle(type: ActionType,userId :string) {
    this.showBanPopup = true
    this.actionType.set(type)
    console.log(`User banned for ${type} type ${userId} user id`);
  }
}

