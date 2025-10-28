import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ThemeService } from '../../../modules/services/theme-service';
import { Materaile } from '../../../modules/materaile-module';
import { Router } from '@angular/router';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { NotificationsServiceLogique } from '../../../core/service/serivecLogique/notifications/notifications-service-logique';

@Component({
  selector: 'app-header',
  imports: [Materaile],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  searchQuery = '';
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  notificationIcons = inject(NotificationsServiceLogique);
  constructor(private auth: AuthService, private global: Global,
    private notifLogique: NotificationsServiceLogique) { }
  isAuthenticated: boolean = false;
  isNotificated = false;

  hasUnreadNotifications = false;
  // private subscription?: Subscription;
  ngOnInit() {
    // console.log(this.notifLogique.checkIsNotAllAsRead(),"-----------------");
    this.notifLogique.loadingNotifications();
    // if (this.notifLogique.checkIsNotAllAsRead()) {

    //   this.hasUnreadNotifications = true
    // }
    this.notificationIcons.notificationIcons$.subscribe({
      next: isNotification => {
        this.hasUnreadNotifications = isNotification
      }
    })
    this.isAuthenticated = this.auth.isLoggedIn();
  }
  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
    }
  }
  ngOnDestroy() {
    // this.subscription?.unsubscribe();
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }


  get currentUser() {
    return true
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
  // onEdit() {
  //   if (this.isComment === true) {
  //     this.global.sharedData.emit({ type: 'comment', data: this.comment });
  //   } else {
  //     this.global.sharedData.emit({ type: 'post', data: this.post });
  //   }
  // }
  notification() {
    this.isNotificated = !this.isNotificated
    this.global.sharedData.emit({ type: 'notification', data: this.isNotificated });
  }
}
