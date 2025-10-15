import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/servicesAPIREST/auth/auth-service';

export const RoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const rout = inject(ActivatedRouteSnapshot);
  const router = inject(Router);
  const expectedRoles = rout.data['roles'] as Array<string>;
  const userRole = authService.getCurrentUserRole();
  if (userRole && expectedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/access-denied']);
    return false;
  }
};
