import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import { RecruiterJobPosting } from "./recruiter.models";

@Component({
  standalone: true,
  selector: "app-recruiter-jobs-page",
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: "./recruiter-jobs-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterJobsPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly postings = signal<RecruiterJobPosting[]>([]);
  readonly togglingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);
  readonly confirmingCloseId = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .jobs()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (postings) => this.postings.set(postings),
        error: (error) =>
          this.notifications.error(error, "Unable to load your job postings."),
      });
  }

  toggleActive(posting: RecruiterJobPosting): void {
    if (!posting.isActive) {
      this.confirmingCloseId.set(null);
      this.applyActive(posting, true);
      return;
    }
    this.confirmingCloseId.set(posting.id);
  }

  cancelClose(): void {
    this.confirmingCloseId.set(null);
  }

  applyActive(posting: RecruiterJobPosting, isActive: boolean): void {
    this.confirmingCloseId.set(null);
    this.togglingId.set(posting.id);
    this.api
      .updateJob(posting.id, {
        title: posting.title,
        company: posting.company,
        location: posting.location,
        workType: posting.workType,
        salaryRange: posting.salaryRange,
        description: posting.description,
        requiredSkills: posting.requiredSkills,
        isActive,
      })
      .pipe(finalize(() => this.togglingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.notifications.success(
            updated.isActive ? "Job posting published." : "Job posting closed.",
          );
          this.postings.update((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          );
        },
        error: (error) =>
          this.notifications.error(error, "Unable to update the posting."),
      });
  }

  requestDelete(id: string): void {
    this.deletingId.set(id);
  }

  cancelDelete(): void {
    this.deletingId.set(null);
  }

  delete(id: string): void {
    this.deletingId.set(null);
    this.api.deleteJob(id).subscribe({
      next: () => {
        this.notifications.success("Job posting deleted.");
        this.postings.update((items) => items.filter((item) => item.id !== id));
      },
      error: (error) =>
        this.notifications.error(error, "Unable to delete the posting."),
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
