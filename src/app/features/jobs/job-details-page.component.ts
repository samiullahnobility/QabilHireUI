import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { JobsApiService } from "./jobs-api.service";
import { JobPosting } from "./jobs.models";

@Component({
  standalone: true,
  selector: "app-job-details-page",
  imports: [MatButtonModule],
  templateUrl: "./job-details-page.component.html",
  styleUrl: "./job-details-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(JobsApiService);
  private readonly notifications = inject(NotificationService);
  readonly job = signal<JobPosting | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly confirmingWithdraw = signal(false);
  private readonly id = this.route.snapshot.paramMap.get("id")!;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .get(this.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (job) => this.job.set(job),
        error: (error) =>
          this.notifications.error(error, "Unable to load this job."),
      });
  }

  apply(): void {
    this.busy.set(true);
    this.api
      .apply(this.id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.notifications.success("Application submitted.");
          this.job.update((job) => (job ? { ...job, hasApplied: true } : job));
        },
        error: (error) =>
          this.notifications.error(error, "Unable to apply for this job."),
      });
  }

  requestWithdraw(): void {
    this.confirmingWithdraw.set(true);
  }

  cancelWithdraw(): void {
    this.confirmingWithdraw.set(false);
  }

  withdraw(): void {
    this.confirmingWithdraw.set(false);
    this.busy.set(true);
    this.api
      .withdraw(this.id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.notifications.success("Application withdrawn.");
          this.job.update((job) => (job ? { ...job, hasApplied: false } : job));
        },
        error: (error) =>
          this.notifications.error(error, "Unable to withdraw your application."),
      });
  }

  toggleSave(): void {
    const job = this.job();
    if (!job) return;
    this.busy.set(true);
    const operation = job.isSaved
      ? this.api.unsave(this.id)
      : this.api.save(this.id);
    operation.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () =>
        this.job.update((current) =>
          current ? { ...current, isSaved: !current.isSaved } : current,
        ),
      error: (error) =>
        this.notifications.error(error, "Unable to update saved jobs."),
    });
  }
}
