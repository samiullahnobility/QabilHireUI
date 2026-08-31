import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { JobsApiService } from "./jobs-api.service";
import { JobPosting } from "./jobs.models";

@Component({
  standalone: true,
  selector: "app-job-search-page",
  imports: [FormsModule, MatButtonModule, RouterLink],
  templateUrl: "./job-search-page.component.html",
  styleUrl: "./job-search-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobSearchPageComponent {
  private readonly api = inject(JobsApiService);
  private readonly notifications = inject(NotificationService);
  readonly jobs = signal<JobPosting[]>([]);
  readonly loading = signal(true);
  readonly workTypes = ["All", "Remote", "Hybrid", "Onsite"] as const;
  readonly activeWorkType = signal<string>("All");
  searchTerm = "";

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const workType = this.activeWorkType() === "All" ? undefined : this.activeWorkType();
    this.api
      .search(this.searchTerm.trim() || undefined, workType)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (jobs) => this.jobs.set(jobs),
        error: (error) =>
          this.notifications.error(error, "Unable to load job listings."),
      });
  }

  selectWorkType(workType: string): void {
    this.activeWorkType.set(workType);
    this.load();
  }

  daysAgo(date: string): string {
    const days = Math.floor(
      (Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000),
    );
    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }
}
