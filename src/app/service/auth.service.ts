import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {baseUrl} from '../app.config';
import {tap} from 'rxjs';
import {LoginResponse} from '../dto/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  private tokenExpiry = signal<number | null>(null);

  signUp(username: string, email: string, password: string) {
    return this.http.post<any>(`${baseUrl}/auth/signup`, {username, email, password});
  }


  setTokenExpiry(expiresInSec : number) {
    this.tokenExpiry.set(Date.now() + (expiresInSec - 10) * 1000); // we give 10 sec flexibility
  }

  isTokenExpired(): boolean {
    const expiry = this.tokenExpiry();
    return expiry ? Date.now() > expiry : true;
  }


  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${baseUrl}/auth/login`, {username, password}).pipe(
      tap(response => {
        this.setTokenExpiry(response.expiresInSec);
      })
    );
  }

  refreshToken() {
    return this.http.post<LoginResponse>(`${baseUrl}/auth/refresh-token`, {})
      .pipe(
        tap(response => {
          this.setTokenExpiry(response.expiresInSec);
        })
      );
  }

  logout() {
    return this.http.post<LoginResponse>(`${baseUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.tokenExpiry.set(null);
      })
    );
  }
}
