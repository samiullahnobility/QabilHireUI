import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, finalize, Observable } from 'rxjs';
import { API_BASE_URL } from '../configuration/api.config';
import { ApiActivityService } from './api-activity.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly activity = inject(ApiActivityService);

  get<T>(path: string): Observable<T> {
    return this.track(path, 'GET', () => this.http.get<T>(`${API_BASE_URL}/${path}`, { withCredentials: true }));
  }

  post<TResponse, TRequest>(path: string, body: TRequest): Observable<TResponse> {
    return this.track(path, 'POST', () => this.http.post<TResponse>(`${API_BASE_URL}/${path}`, body, { withCredentials: true }));
  }

  postForm<TResponse>(path: string, body: FormData): Observable<TResponse> {
    return this.track(path, 'POST', () => this.http.post<TResponse>(`${API_BASE_URL}/${path}`, body, { withCredentials: true }));
  }

  put<TResponse, TRequest>(path: string, body: TRequest): Observable<TResponse> {
    return this.track(path, 'PUT', () => this.http.put<TResponse>(`${API_BASE_URL}/${path}`, body, { withCredentials: true }));
  }

  delete<T>(path: string): Observable<T> {
    return this.track(path, 'DELETE', () => this.http.delete<T>(`${API_BASE_URL}/${path}`, { withCredentials: true }));
  }

  private track<T>(path: string, method: string, request: () => Observable<T>): Observable<T> {
    return defer(() => {
      const activityId = this.activity.begin(this.messageFor(path, method));
      return request().pipe(finalize(() => this.activity.end(activityId)));
    });
  }

  private messageFor(path: string, method: string): string {
    if (path === 'auth/register') return 'Creating your QabilHire account...';
    if (path === 'auth/login') return 'Signing you in...';
    if (path === 'auth/logout') return 'Signing you out...';
    if (path === 'auth/refresh') return 'Restoring your session...';
    if (path === 'auth/forgot-password') return 'Sending your password-reset email...';
    if (path === 'auth/reset-password') return 'Resetting your password...';
    if (/resumes\/[^/]+\/extract$/.test(path)) return 'Extracting your resume with AI...';
    if (/resumes\/[^/]+\/analyze$/.test(path)) return 'Analyzing your resume...';
    if (/resumes\/[^/]+\/extracted-data$/.test(path)) return 'Saving your resume corrections...';
    if (/resumes\/[^/]+\/active$/.test(path)) return 'Setting your active resume...';
    if (/resumes\/[^/]+\/archive$/.test(path)) return 'Updating your resume archive...';
    if (path === 'resumes' && method === 'POST') return 'Uploading your resume...';
    if (path.startsWith('resumes') && method === 'DELETE') return 'Deleting your resume...';
    if (path.startsWith('resumes') && method === 'GET') return path === 'resumes' ? 'Loading your resumes...' : 'Loading your resume...';
    if (path.startsWith('profile') && method === 'GET') return 'Loading your profile...';
    if (path.startsWith('profile')) return 'Saving your profile...';
    if (path === 'job-matches' && method === 'POST') return 'Analyzing your job match with AI...';
    if (path.startsWith('job-matches') && method === 'GET') return 'Loading your job match...';
    if (path === 'interviews' && method === 'POST') return 'Generating your interview questions with AI...';
    if (path.startsWith('interviews') && method === 'GET') return 'Loading your interview...';
    if (/interviews\/[^/]+\/start$/.test(path)) return 'Starting your interview...';
    if (/interviews\/[^/]+\/answers$/.test(path)) return 'Saving your answer...';
    if (/interviews\/[^/]+\/questions\/[^/]+\/transcribe$/.test(path)) return 'Transcribing your temporary recording...';
    return method === 'GET' ? 'Loading your information...' : 'Saving your changes...';
  }
}
