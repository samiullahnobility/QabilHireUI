import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ResumeApiService } from './resume-api.service';
import { ResumeResponse } from './resume-api.models';

@Component({
  standalone: true,
  selector: 'app-resume-analysis-page',
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

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: resume => this.resume.set(resume),
      error: error => this.notifications.error(error, 'Unable to load resume analysis.')
    });
  }
}
