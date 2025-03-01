import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, catchError } from 'rxjs';

let requestCount = 0; // Track active requests

export const loadingInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const spinner = inject(NgxSpinnerService); // Inject spinner service

  requestCount++;
  spinner.show(); // Show spinner when a request starts

  return next(request).pipe(
    catchError((error) => {
      requestCount--; 
      throw error;
    }),
    finalize(() => {
      requestCount--;
      if (requestCount <= 0) {
        spinner.hide(); // Hide spinner when all requests are complete
      }
    })
  );
};
