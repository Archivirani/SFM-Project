import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { IdentityService } from '../services/identity.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const identityService = inject(IdentityService);
  const router = inject(Router);
  const authToken = identityService.getToken();
  let authReq = req;
  // Clone the request and add the authorization header
  if (authToken && !req.headers.get('no-auth')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // Pass the cloned request with the updated header to the next handler
  return next(authReq).pipe(
    catchError((err: any) => {
      // Remove caught: HttpResponse
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401 && !identityService.isAccessTokenExpired()) {
          // Specific handling for unauthorized errors
          return identityService.refreshAccessToken().pipe(
            switchMap((response: any) => {
              // Update tokens
              identityService.setToken(response.accessToken);
              identityService.setRefreshToken(response.refreshToken);

              // Retry the original request
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });
              return next(req);
            }),
            catchError((err) => {
              // Logout user if refresh token fails
              identityService.clearToken();
              router.navigateByUrl('/login');       
              return throwError(() => new Error(err));
            })
          );

          // You might trigger a re-authentication flow or redirect the user here
        } else if (err.status === 0) {
          //Temporary implementation untill it API use/return 401 status

          console.error('Unauthorized request:', err);
          identityService.clearToken();
          router.navigateByUrl('/login');
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};
