import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/servicesAPIREST/auth/auth-service';
import { NotificationService } from '../../service/notificationAlert/NotificationService';

// @Injectable({
//   providedIn: 'root'
// })
export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const notificationAlert = inject(NotificationService)
  console.log(auth.hasRole('ADMIN'), "admin ****************");
  if (auth.isLoggedIn() && auth.hasRole('ADMIN')) {

    // router.navigate(['/home'])
    return true;
  }
  notificationAlert.showError('Access forbidden. You don\'t have permission.', false);
  router.navigate(['/home']);
  return false
}