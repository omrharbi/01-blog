import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ThemeService } from '../../../modules/services/theme-service';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-header',
  imports: [Materaile],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchQuery = '';
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement your search logic here
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get isAuthenticated() {
    return true
  }

  get currentUser() {
    return true
  }

  logout() {
    this.authService.logout();
  }
}
