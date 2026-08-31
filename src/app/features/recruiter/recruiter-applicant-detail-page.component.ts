import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import {
  APPLICATION_STAGES,
  ApplicantDetail,
  STAGE_TRANSITIONS,
} from "./recruiter.models";

@Component({
  standalone: true,
  selector: "app-recruiter-applicant-detail-page",
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: "./recruiter-applicant-detail-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterApplicantDetailPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(true);
  readonly savingStage = signal(false);
  readonly downloading = signal(false);
  readonly detail = signal<ApplicantDetail | null>(null);
  readonly stages = APPLICATION_STAGES;

  constructor() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.load(id);
  }

  load(id: string): void {
    this.loading.set(true);
    this.api
      .application(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (detail) => this.detail.set(detail),
        error: (error) =>
          this.notifications.error(error, "Unable to load the applicant."),
      });
  }

  nextStages(): string[] {
    const current = this.detail()?.status as keyof typeof STAGE_TRANSITIONS;
    return current ? [...STAGE_TRANSITIONS[current]] : [];
  }

  moveTo(stage: string): void {
    const detail = this.detail();
    if (!detail) return;
    this.savingStage.set(true);
    this.api
      .updateApplicationStatus(detail.applicationId, stage)
      .pipe(finalize(() => this.savingStage.set(false)))
      .subscribe({
        next: (updated) => {
          this.notifications.success(`Application moved to ${updated.status}.`);
          this.detail.update((current) =>
            current
              ? {
                  ...current,
                  status: updated.status,
                  statusUpdatedAtUtc: updated.statusUpdatedAtUtc,
                }
              : current,
          );
        },
        error: (error) =>
          this.notifications.error(error, "Unable to update the stage."),
      });
  }

  downloadResume(): void {
    const detail = this.detail();
    if (!detail) return;
    this.downloading.set(true);
    this.api
      .applicationResume(detail.applicationId)
      .pipe(finalize(() => this.downloading.set(false)))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = detail.resume?.fileName ?? "resume";
          anchor.click();
          URL.revokeObjectURL(url);
        },
        error: (error) =>
          this.notifications.error(error, "Unable to download the resume."),
      });
  }

  formatDate(date: string | null): string {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatDateTime(date: string | null): string {
    if (!date) return "—";
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  stageClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
