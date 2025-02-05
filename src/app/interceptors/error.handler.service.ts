import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable(

)
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log(error);
        let errorMessage = 'An unexpected error occurred';

        if (error.status === 403) {
          errorMessage = 'Access denied! You do not have permission to perform this action.';
        } else if (error.status === 500) {
          errorMessage = 'Server error! Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Network error! Please check your internet connection.';
        } else if (error.error && error.error.errorMessage) {
          errorMessage = error.error.errorMessage;
        }

        // Show a popup notification
        this.snackBar.open(errorMessage, 'Close', {
          duration: 2500,
          verticalPosition: 'top',
          panelClass: ['fail-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
