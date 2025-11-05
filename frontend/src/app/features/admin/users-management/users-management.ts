import { Component, EventEmitter, inject, input, signal, computed } from '@angular/core';
import { ActionType, UserResponseInAdmin } from '../../../core/models/admin/UserResponseInAdmin';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { Materaile } from '../../../modules/materaile-module';
import { BanPopup } from '../ban-popup/ban-popup';
import { AdminServiceShared } from '../../../core/service/serivecLogique/admin/admin-service';

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
  adminService = inject(AdminServiceShared);
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  loading = signal(false);
  startIndex = computed(() => this.currentPage() * this.pageSize() + 1);
  endIndex = computed(() =>
    Math.min(this.startIndex() + this.allUsers().length - 1, this.totalPages())
  );

  userId = signal<string>('')
  ngOnInit() {
    this.getAllUsers()

    this.adminService.update_user$.subscribe({
      next: response => {
        this.allUsers.update(users =>
          users.map(u =>
            u.id === response?.id ? { ...u, ...response } : u
          )
        );
      }
    })

    this.adminService.check_delete_user$.subscribe({
      next: response => {
        if (response == true) {
          this.allUsers.update(users => users.filter(u => u.id !== this.userId()));
        }
      }
    })
  }
  getAllUsers() {
    this.admin.getAllUsers(0, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.allUsers.set(response.data.content);
          console.log(response);
          
          this.totalPages.set(response.data.totalElements);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  showMore() {
    if (this.loading() || this.currentPage() >= this.totalPages() - 1) return;
    this.loading.set(true);

    const nextPage = this.currentPage() + 1;
    this.admin.getAllUsers(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.allUsers.update(user => [...user, ...response.data.content]);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }


  actionTypeHandle(type: ActionType, userId: string) {
    this.showBanPopup = true
    this.actionType.set(type)
    this.userId.set(userId)
  }
  getAdmins() {
    const nextPage = this.currentPage() + 1;
    this.admin.getAdmins(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.allUsers.update(user => [...user, ...response.data.content]);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  getActiveUsers() {
    const nextPage = this.currentPage() + 1;
    this.admin.activeUsers(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.allUsers.update(user => [...user, ...response.data.content]);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  bannedUsers() {
    const nextPage = this.currentPage() + 1;
    this.admin.bannedUser(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.allUsers.update(user => [...user, ...response.data.content]);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}

