import { inject, Injectable, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthResponse, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenKey = 'qabilhire_access_token';
  private readonly expiresKey = 'qabilhire_access_token_expires_at';
  private readonly userKey = 'qabilhire_user';
  readonly currentUser = signal<AuthResponse['user'] | null>(this.restoreUser());
  readonly isAuthenticated = signal(this.hasValidSession());

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

  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.api.post<{ message: string }, ForgotPasswordRequest>('auth/forgot-password', request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.api.post<void, ResetPasswordRequest>('auth/reset-password', request);
  }

  getAccessToken(): string | null {
    if (!this.hasValidSession()) {
      this.clearSession();
      return null;
    }

    return sessionStorage.getItem(this.tokenKey);
  }

  loadCurrentUser(): Observable<AuthResponse['user']> {
    return this.api.get<AuthResponse['user']>('auth/me').pipe(
      tap(user => {
        sessionStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }

  refresh(): Observable<AuthResponse> {
    return this.api.post<AuthResponse, Record<string, never>>('auth/refresh', {}).pipe(
      tap(response => this.saveSession(response))
    );
  }

  logout(): Observable<void> {
    return this.api.post<void, Record<string, never>>('auth/logout', {}).pipe(
      finalize(() => this.clearSession())
    );
  }

  clearLocalSession(): void {
    this.clearSession();
  }

  markProfileComplete(): void {
    const user = this.currentUser();
    if (!user) return;
    const updatedUser = { ...user, profileComplete: true };
    sessionStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.currentUser.set(updatedUser);
  }

  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem(this.tokenKey, response.accessToken);
    sessionStorage.setItem(this.expiresKey, response.expiresAtUtc);
    sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private restoreUser(): AuthResponse['user'] | null {
    if (!this.hasValidSession()) {
      this.clearStoredSession();
      return null;
    }

    const storedUser = sessionStorage.getItem(this.userKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthResponse['user'];
    } catch {
      this.clearStoredSession();
      return null;
    }
  }

  private hasValidSession(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    const expiresAt = sessionStorage.getItem(this.expiresKey);
    return Boolean(token && expiresAt && Date.parse(expiresAt) > Date.now());
  }

  private clearSession(): void {
    this.clearStoredSession();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private clearStoredSession(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.expiresKey);
    sessionStorage.removeItem(this.userKey);
  }
}
