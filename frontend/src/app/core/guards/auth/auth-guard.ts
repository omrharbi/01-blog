import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/servicesAPIREST/auth/auth-service';
import { NotificationService } from '../../service/notificationAlert/NotificationService';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationAlert = inject(NotificationService);
  if (!authService.isLoggedIn()) {
      notificationAlert.showError('Your session has expired. Please log in again.', true);
    // not logged in → send to login
    return false;
  }
  return true; // logged in → allow access
};
