import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { finalize, switchMap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ResumeApiService } from './resume-api.service';
import { ResumeResponse } from './resume-api.models';
import { ResumeLoadingOverlayComponent } from './resume-loading-overlay.component';

@Component({
  standalone: true,
  selector: 'app-resume-upload-page',
  imports: [MatButtonModule, ResumeLoadingOverlayComponent],
  templateUrl: './resume-upload-page.component.html',
  styleUrl: './resume-upload-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeUploadPageComponent {
  private readonly api = inject(ResumeApiService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly selectedFile = signal<File | null>(null);
  readonly uploaded = signal<ResumeResponse | null>(null);
  readonly uploading = signal(false);
  readonly extracting = signal(false);

  choose(event: Event): void {
    this.selectedFile.set((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  fileSize(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.uploading.set(true);
    this.api.upload(file).pipe(
      switchMap(resume => {
        this.uploaded.set(resume);
        this.extracting.set(true);
        return this.api.extract(resume.id);
      }),
      finalize(() => { this.uploading.set(false); this.extracting.set(false); })
    ).subscribe({
      next: resume => {
        this.uploaded.set(resume);
        this.notifications.success('Resume uploaded and extracted. Please review the information.');
        void this.router.navigate(['/app/resume', resume.id, 'edit']);
      },
      error: error => this.notifications.error(error, 'Unable to upload or extract resume.')
    });
  }

}
