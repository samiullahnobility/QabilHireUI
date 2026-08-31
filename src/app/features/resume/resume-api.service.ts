import { inject, Injectable } from "@angular/core";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { filter, map, Observable } from "rxjs";
import { ApiService } from "../../core/services/api.service";
import { ResumeResponse, ResumeUploadProgress } from "./resume-api.models";

@Injectable({ providedIn: "root" })
export class ResumeApiService {
  private readonly api = inject(ApiService);

  list(): Observable<ResumeResponse[]> {
    return this.api.get<ResumeResponse[]>("resumes");
  }
  get(id: string): Observable<ResumeResponse> {
    return this.api.get<ResumeResponse>(`resumes/${id}`);
  }
  upload(file: File): Observable<ResumeResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return this.api.postForm<ResumeResponse>("resumes", formData);
  }
  uploadWithProgress(file: File): Observable<ResumeUploadProgress> {
    const formData = new FormData();
    formData.append("file", file);
    return this.api.postFormEvents<ResumeResponse>("resumes", formData).pipe(
      filter(
        (event) =>
          event.type === HttpEventType.UploadProgress ||
          event.type === HttpEventType.Response,
      ),
      map((event): ResumeUploadProgress => {
        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<ResumeResponse>;
          return {
            kind: "complete",
            resume: response.body ?? ({} as ResumeResponse),
          };
        }
        const progress = event as { loaded?: number; total?: number };
        return {
          kind: "progress",
          percent:
            progress.total && progress.total > 0
              ? Math.round((100 * (progress.loaded ?? 0)) / progress.total)
              : 0,
        };
      }),
    );
  }
  extract(id: string): Observable<ResumeResponse> {
    return this.api.post<ResumeResponse, Record<string, never>>(
      `resumes/${id}/extract`,
      {},
    );
  }
  analyze(id: string): Observable<ResumeResponse> {
    return this.api.post<ResumeResponse, Record<string, never>>(
      `resumes/${id}/analyze`,
      {},
    );
  }
  updateExtractedData(
    id: string,
    extractedJson: string,
  ): Observable<ResumeResponse> {
    return this.api.put<ResumeResponse, { extractedJson: string }>(
      `resumes/${id}/extracted-data`,
      { extractedJson },
    );
  }
  updateMetadata(
    id: string,
    displayName: string,
    targetRole: string | null,
  ): Observable<ResumeResponse> {
    return this.api.put<
      ResumeResponse,
      { displayName: string; targetRole: string | null }
    >(`resumes/${id}/metadata`, { displayName, targetRole });
  }
  setActive(id: string): Observable<ResumeResponse> {
    return this.api.put<ResumeResponse, Record<string, never>>(
      `resumes/${id}/active`,
      {},
    );
  }
  toggleArchive(id: string): Observable<ResumeResponse> {
    return this.api.put<ResumeResponse, Record<string, never>>(
      `resumes/${id}/archive`,
      {},
    );
  }
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`resumes/${id}`);
  }
}
