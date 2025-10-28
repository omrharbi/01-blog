import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ThemeService } from '../../../modules/services/theme-service';
import { Materaile } from '../../../modules/materaile-module';
import { Router } from '@angular/router';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { NotificationsServiceLogique } from '../../../core/service/serivecLogique/notifications/notifications-service-logique';
import { ClickOutsideDirective } from '../../../core/Customdiractive/diractive-evenet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [Materaile, ClickOutsideDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
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

  toggleNotification(event: MouseEvent) {
    // event.stopPropagation();
    this.isNotificated = !this.isNotificated
    this.global.sharedData.emit({
      type: 'notification',
      data: this.isNotificated
    });
  }


}
