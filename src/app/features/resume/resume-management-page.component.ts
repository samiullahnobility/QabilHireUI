import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { ResumeApiService } from './resume-api.service';
import { ResumeResponse } from './resume-api.models';

@Component({
  standalone: true,
  selector: 'app-resume-management-page',
  imports: [RouterLink],
  templateUrl: './resume-management-page.component.html',
  styleUrl: './resume-management-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeManagementPageComponent {
  private readonly api = inject(ResumeApiService);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly resumes = signal<ResumeResponse[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api.list().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: items => this.resumes.set(items),
      error: error => this.notifications.error(error, 'Unable to load your resume.')
    });
  }

  delete(id: string): void {
    this.api.delete(id).subscribe({
      next: () => this.resumes.update(items => items.filter(item => item.id !== id)),
      error: error => this.notifications.error(error, 'Unable to delete your resume.')
    });
  }

  setActive(id: string): void {
    this.api.setActive(id).subscribe({ next: () => this.refresh(), error: error => this.notifications.error(error, 'Unable to set the active resume.') });
  }

  toggleArchive(id: string): void {
    this.api.toggleArchive(id).subscribe({ next: () => this.refresh(), error: error => this.notifications.error(error, 'Unable to update the resume archive.') });
  }
}
