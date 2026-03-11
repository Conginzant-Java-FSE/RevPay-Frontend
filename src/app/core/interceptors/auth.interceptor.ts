import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AdminService } from '../services/admin.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const adminService = inject(AdminService);
  const url = req.url;

  // Use admin token for /api/admin/ requests
  if (url.includes('/api/admin/')) {
    const adminToken = adminService.getToken();
    if (adminToken) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${adminToken}` }
      });
      return next(cloned);
    }
    return next(req);
  }

  // Use user token for other API requests
  const token = tokenService.getToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};