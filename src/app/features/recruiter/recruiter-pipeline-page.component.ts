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
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import { EMPTY, expand, finalize, reduce } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import {
  APPLICATION_STAGES,
  ApplicantListItem,
  RecruiterJobPosting,
  STAGE_TRANSITIONS,
} from "./recruiter.models";

@Component({
  standalone: true,
  selector: "app-recruiter-pipeline-page",
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: "./recruiter-pipeline-page.component.html",
  styleUrls: ["./recruiter.css", "./recruiter-pipeline-page.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterPipelinePageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  readonly columns = APPLICATION_STAGES;
  readonly loading = signal(true);
  readonly movingId = signal<string | null>(null);
  readonly items = signal<ApplicantListItem[]>([]);
  readonly jobs = signal<RecruiterJobPosting[]>([]);
  jobId = "";

  constructor() {
    this.api.jobs().subscribe({
      next: (jobs) => this.jobs.set(jobs),
      error: () => this.jobs.set([]),
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.fetchAllPages()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => this.items.set(items),
        error: (error) =>
          this.notifications.error(error, "Unable to load the pipeline."),
      });
  }

  private fetchAllPages() {
    const pageOf = (page: number) =>
      this.api.applications({
        jobId: this.jobId || undefined,
        page,
        pageSize: 50,
      });
    return pageOf(1).pipe(
      expand((result) =>
        result.page < result.totalPages ? pageOf(result.page + 1) : EMPTY,
      ),
      reduce(
        (all: ApplicantListItem[], result) => [...all, ...result.items],
        [] as ApplicantListItem[],
      ),
    );
  }

  applicantsFor(stage: string): ApplicantListItem[] {
    return this.items().filter((item) => item.status === stage);
  }

  nextStages(status: string): string[] {
    return [...STAGE_TRANSITIONS[status as keyof typeof STAGE_TRANSITIONS]];
  }

  move(applicant: ApplicantListItem, stage: string): void {
    this.movingId.set(applicant.applicationId);
    this.api
      .updateApplicationStatus(applicant.applicationId, stage)
      .pipe(finalize(() => this.movingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.notifications.success(
            `${applicant.fullName} moved to ${updated.status}.`,
          );
          this.items.update((items) =>
            items.map((item) =>
              item.applicationId === updated.applicationId ? updated : item,
            ),
          );
        },
        error: (error) =>
          this.notifications.error(error, "Unable to move the application."),
      });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  stageBadgeClass(stage: string): string {
    return `badge-${stage.toLowerCase()}`;
  }
}
