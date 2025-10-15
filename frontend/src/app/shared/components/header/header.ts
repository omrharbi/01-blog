import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ThemeService } from '../../../modules/services/theme-service';
import { Materaile } from '../../../modules/materaile-module';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
 
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
  constructor(private auth: AuthService) { }
  isAuthenticated: boolean = false;
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
  }
  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement your search logic here
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
}
