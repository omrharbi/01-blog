import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ThemeService } from '../../../modules/services/theme-service';
import { Materaile } from '../../../modules/materaile-module';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import { NotificationPopup } from '../../../features/notifications/notifications';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';

@Component({
  selector: 'app-header',
  imports: [Materaile],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchQuery = '';
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  constructor(private auth: AuthService, private global: Global) { }
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
