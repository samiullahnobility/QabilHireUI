import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import {
  APPLICATION_STAGES,
  ApplicantList,
  RecruiterJobPosting,
} from "./recruiter.models";

@Component({
  standalone: true,
  selector: "app-recruiter-applicants-page",
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: "./recruiter-applicants-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterApplicantsPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  readonly stages = APPLICATION_STAGES;
  readonly loading = signal(true);
  readonly result = signal<ApplicantList | null>(null);
  readonly jobs = signal<RecruiterJobPosting[]>([]);
  search = "";
  status = "";
  jobId = "";

  constructor() {
    const query = this.route.snapshot.queryParamMap;
    this.jobId = query.get("jobId") ?? "";
    this.api.jobs().subscribe({
      next: (jobs) => this.jobs.set(jobs),
      error: () => this.jobs.set([]),
    });
    this.load();
  }

  load(page = 1): void {
    this.loading.set(true);
    this.api
      .applications({
        search: this.search.trim() || undefined,
        jobId: this.jobId || undefined,
        status: this.status || undefined,
        page,
        pageSize: 10,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => this.result.set(result),
        error: (error) =>
          this.notifications.error(error, "Unable to load applicants."),
      });
  }

  changePage(page: number): void {
    const current = this.result();
    if (!current || page < 1 || page > current.totalPages || page === current.page) {
      return;
    }
    this.load(page);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  stageClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
