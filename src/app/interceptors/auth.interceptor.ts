import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, from, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from '../service/auth.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUrls = ['/auth/login', '/auth/refresh-token']; // Skip these endpoints
    if (authUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    if (this.authService.isTokenExpired()) {
      return from(this.authService.refreshToken()).pipe(
        switchMap(() => {
          return next.handle(req);
        }),
        catchError(err => {
          this.authService.setTokenExpiry(0);
          this.router.navigate(['/login']);

          this.snackBar.open("Session expired, please log in", 'Close', {
            duration: 2500,
            verticalPosition: 'top',
            panelClass: ['fail-snackbar']
          });

          return EMPTY;
        })
      );
    }

    return next.handle(req);
  }
}
