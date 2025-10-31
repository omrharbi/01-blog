import { Component, EventEmitter, inject, OnDestroy, OnInit, output, Output, signal } from '@angular/core';
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
  s = signal('')
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  notificationIcons = inject(NotificationsServiceLogique);
  constructor(private auth: AuthService, private global: Global,
    private notifLogique: NotificationsServiceLogique) { }
  isAuthenticated: boolean = false;
  isNotificated = false;
  @Output() isShowPopUp = new EventEmitter<any>();
  // dfgdf = output();
  hasUnreadNotifications = false;
  ngOnInit() {
    this.notifLogique.loadingNotifications();
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
  SignIn() {
    this.router.navigate(['/login']);
  }
  SignUp() {
    this.router.navigate(['/register']);
  }
  get currentUser() {
    return true
  }

  logout() {
    this.authService.logout();
    window.location.href = '/';
  }
  OnPopUp(isInside: boolean) {
    console.log(isInside, "****");
    if (isInside) {
      this.global.sharedData.emit({ type: 'notification', data: true });
      this.isNotificated = !this.isNotificated;
    } else {
      this.global.sharedData.emit({ type: 'notification', data: false });
      this.isNotificated = false;
    }
  }
  notification() {
    this.isNotificated = !this.isNotificated
    this.global.sharedData.emit({ type: 'notification', data: this.isNotificated });
  }
}
