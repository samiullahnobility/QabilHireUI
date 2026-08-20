import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ResumeApiService } from './resume-api.service';
import { ResumeAnalysisData, ResumeResponse } from './resume-api.models';
import { ResumeLoadingOverlayComponent } from './resume-loading-overlay.component';

@Component({
  standalone: true,
  selector: 'app-resume-analysis-page',
  imports: [ResumeLoadingOverlayComponent],
  templateUrl: './resume-analysis-page.component.html',
  styleUrl: './resume-analysis-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeAnalysisPageComponent {
  private readonly api = inject(ResumeApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly resume = signal<ResumeResponse | null>(null);
  readonly analysis = signal<ResumeAnalysisData | null>(null);
  readonly activeTab = signal<'overview' | 'extracted' | 'strengths' | 'missing' | 'keywords'>('overview');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: resume => {
        this.resume.set(resume);
        try { this.analysis.set(resume.analysisJson ? JSON.parse(resume.analysisJson) : null); }
        catch { this.analysis.set(null); }
      },
      error: error => this.notifications.error(error, 'Unable to load resume analysis.')
    });
  }
}
