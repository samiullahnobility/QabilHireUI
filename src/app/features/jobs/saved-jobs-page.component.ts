import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { JobsApiService } from "./jobs-api.service";
import { SavedJob } from "./jobs.models";

@Component({
  standalone: true,
  selector: "app-saved-jobs-page",
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./saved-jobs-page.component.html",
  styleUrl: "./saved-jobs-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedJobsPageComponent {
  private readonly api = inject(JobsApiService);
  private readonly notifications = inject(NotificationService);
  readonly jobs = signal<SavedJob[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .savedJobs()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (jobs) => this.jobs.set(jobs),
        error: (error) =>
          this.notifications.error(error, "Unable to load saved jobs."),
      });
  }

  unsave(id: string, postingId: string): void {
    this.api.unsave(postingId).subscribe({
      next: () => {
        this.notifications.success("Removed from saved jobs.");
        this.jobs.update((items) => items.filter((item) => item.id !== id));
      },
      error: (error) =>
        this.notifications.error(error, "Unable to update saved jobs."),
    });
  }
}
