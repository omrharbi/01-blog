// src/app/core/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = false;

  constructor() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('dark-theme');
    if (savedTheme) {
      this.darkTheme = savedTheme === 'true';
      this.updateBodyClass();
    }
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('dark-theme', this.darkTheme.toString());
    this.updateBodyClass();
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  private updateBodyClass() {
    if (this.darkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
