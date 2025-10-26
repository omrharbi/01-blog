import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ThemeService } from '../../../modules/services/theme-service';
import { Materaile } from '../../../modules/materaile-module';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { NotificationPopup } from '../../../features/notifications/notifications';

@Component({
  selector: 'app-header',
  imports: [Materaile, NotificationPopup],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchQuery = '';
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  constructor(private auth: AuthService) { }
  isAuthenticated: boolean = false;
  isNotificated = false;
  ngOnInit() {
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

  notification(isNotification: boolean) {
    if (isNotification) {
      // console.log("jhkjlhflkjqhwlkjfew");
      
      this.isNotificated = !this.isNotificated
    } else {
      this.isNotificated = false
    }
  }
}
