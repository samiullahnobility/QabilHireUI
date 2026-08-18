import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthResponse, LoginRequest, RegisterRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenKey = 'qabilhire_access_token';
  readonly currentUser = signal<AuthResponse['user'] | null>(null);

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse, RegisterRequest>('auth/register', request).pipe(
      tap(response => this.saveSession(response))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse, LoginRequest>('auth/login', request).pipe(
      tap(response => this.saveSession(response))
    );
  }

  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem(this.tokenKey, response.accessToken);
    this.currentUser.set(response.user);
  }
}
