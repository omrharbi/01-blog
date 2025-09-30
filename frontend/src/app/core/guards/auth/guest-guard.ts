import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    router.navigate(['/']); // not logged in → send to login
    return false;
  }
  return true; // logged in → allow access
};
