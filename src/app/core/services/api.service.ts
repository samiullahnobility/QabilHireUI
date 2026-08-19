import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../configuration/api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}/${path}`, { withCredentials: true });
  }

  post<TResponse, TRequest>(path: string, body: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(`${API_BASE_URL}/${path}`, body, { withCredentials: true });
  }

  postForm<TResponse>(path: string, body: FormData): Observable<TResponse> {
    return this.http.post<TResponse>(`${API_BASE_URL}/${path}`, body, { withCredentials: true });
  }

  put<TResponse, TRequest>(path: string, body: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(`${API_BASE_URL}/${path}`, body, { withCredentials: true });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}/${path}`, { withCredentials: true });
  }
}
