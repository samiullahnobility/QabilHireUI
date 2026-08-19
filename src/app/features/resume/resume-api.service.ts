import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ResumeResponse } from './resume-api.models';

@Injectable({ providedIn: 'root' })
export class ResumeApiService {
  private readonly api = inject(ApiService);

  list(): Observable<ResumeResponse[]> { return this.api.get<ResumeResponse[]>('resumes'); }
  get(id: string): Observable<ResumeResponse> { return this.api.get<ResumeResponse>(`resumes/${id}`); }
  upload(file: File): Observable<ResumeResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.postForm<ResumeResponse>('resumes', formData);
  }
  extract(id: string): Observable<ResumeResponse> { return this.api.post<ResumeResponse, Record<string, never>>(`resumes/${id}/extract`, {}); }
  analyze(id: string): Observable<ResumeResponse> { return this.api.post<ResumeResponse, Record<string, never>>(`resumes/${id}/analyze`, {}); }
  updateExtractedData(id: string, extractedJson: string): Observable<ResumeResponse> { return this.api.put<ResumeResponse, { extractedJson: string }>(`resumes/${id}/extracted-data`, { extractedJson }); }
  updateMetadata(id: string, displayName: string, targetRole: string | null): Observable<ResumeResponse> { return this.api.put<ResumeResponse, { displayName: string; targetRole: string | null }>(`resumes/${id}/metadata`, { displayName, targetRole }); }
  setActive(id: string): Observable<ResumeResponse> { return this.api.put<ResumeResponse, Record<string, never>>(`resumes/${id}/active`, {}); }
  toggleArchive(id: string): Observable<ResumeResponse> { return this.api.put<ResumeResponse, Record<string, never>>(`resumes/${id}/archive`, {}); }
  delete(id: string): Observable<void> { return this.api.delete<void>(`resumes/${id}`); }
}
