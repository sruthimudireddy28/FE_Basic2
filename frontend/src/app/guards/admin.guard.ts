import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (token && role === 'Admin') {
    return true;
  }

  alert('Unauthorized access. Admin role required.');
  router.navigate(['/']);
  return false;
};
