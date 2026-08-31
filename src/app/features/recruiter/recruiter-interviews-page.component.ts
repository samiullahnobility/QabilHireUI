import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EMPTY, expand, finalize, reduce } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import {
  ApplicantListItem,
  CreateInterviewRequest,
  INTERVIEW_MODES,
  InterviewMode,
  RecruiterInterview,
  Recommendation,
  RECOMMENDATIONS,
  SubmitFeedbackRequest,
  UpdateInterviewRequest,
} from "./recruiter.models";

type InterviewFilter = "upcoming" | "past" | "all";

@Component({
  standalone: true,
  selector: "app-recruiter-interviews-page",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: "./recruiter-interviews-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterInterviewsPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly modes = INTERVIEW_MODES;
  readonly recommendations = RECOMMENDATIONS;
  readonly loading = signal(true);
  readonly interviews = signal<RecruiterInterview[]>([]);
  readonly applications = signal<ApplicantListItem[]>([]);
  readonly filter = signal<InterviewFilter>("upcoming");

  readonly scheduleOpen = signal(false);
  readonly savingSchedule = signal(false);
  readonly rescheduleId = signal<string | null>(null);
  readonly savingReschedule = signal(false);
  readonly feedbackId = signal<string | null>(null);
  readonly savingFeedback = signal(false);
  readonly confirmingCancelId = signal<string | null>(null);
  readonly confirmingCompleteId = signal<string | null>(null);
  readonly cancellingId = signal<string | null>(null);
  readonly completingId = signal<string | null>(null);

  private preselectApplicationId: string | null = null;
  private applicationsLoaded = false;
  private interviewsLoaded = false;

  readonly filtered = computed(() => {
    const list = this.interviews();
    const filter = this.filter();
    if (filter === "upcoming") {
      return list.filter((interview) => interview.status === "Scheduled");
    }
    if (filter === "past") {
      return list.filter((interview) => interview.status !== "Scheduled");
    }
    return list;
  });

  readonly scheduleCandidates = computed(() => {
    const scheduled = new Set(
      this.interviews()
        .filter((interview) => interview.status === "Scheduled")
        .map((interview) => interview.jobApplicationId),
    );
    return this.applications().filter(
      (application) => !scheduled.has(application.applicationId),
    );
  });

  scheduleForm = this.fb.nonNullable.group({
    jobApplicationId: ["", [Validators.required]],
    scheduledAtLocal: ["", [Validators.required]],
    durationMinutes: [30, [Validators.required, Validators.min(15), Validators.max(240)]],
    mode: ["Video", [Validators.required]],
    locationOrLink: ["", Validators.maxLength(500)],
  });

  rescheduleForm = this.fb.nonNullable.group({
    scheduledAtLocal: ["", [Validators.required]],
    durationMinutes: [30, [Validators.required, Validators.min(15), Validators.max(240)]],
    mode: ["Video", [Validators.required]],
    locationOrLink: ["", Validators.maxLength(500)],
  });

  feedbackForm = this.fb.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    strengths: ["", Validators.maxLength(2000)],
    weaknesses: ["", Validators.maxLength(2000)],
    recommendation: ["Consider", [Validators.required]],
  });

  constructor() {
    this.preselectApplicationId =
      this.route.snapshot.queryParamMap.get("applicationId");
    this.api
      .interviews()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (interviews) => {
          this.interviews.set(interviews);
          this.interviewsLoaded = true;
          this.tryOpenPreselect();
        },
        error: (error) =>
          this.notifications.error(error, "Unable to load interviews."),
      });
    this.loadApplications();
  }

  private loadApplications(): void {
    const pageOf = (page: number) => this.api.applications({ page, pageSize: 50 });
    pageOf(1)
      .pipe(
        expand((result) =>
          result.page < result.totalPages ? pageOf(result.page + 1) : EMPTY,
        ),
        reduce(
          (all, result) => [...all, ...result.items],
          [] as ApplicantListItem[],
        ),
      )
      .subscribe({
        next: (applications) => {
          this.applications.set(applications);
          this.applicationsLoaded = true;
          this.tryOpenPreselect();
        },
        error: (error) =>
          this.notifications.error(
            error,
            "Unable to load applicants for scheduling.",
          ),
      });
  }

  private tryOpenPreselect(): void {
    if (
      !this.preselectApplicationId ||
      !this.applicationsLoaded ||
      !this.interviewsLoaded ||
      this.scheduleOpen()
    ) {
      return;
    }
    const exists = this.scheduleCandidates().some(
      (application) => application.applicationId === this.preselectApplicationId,
    );
    if (exists) {
      this.openSchedule(this.preselectApplicationId);
    }
    this.preselectApplicationId = null;
  }

  openSchedule(applicationId = ""): void {
    this.scheduleForm.reset({
      jobApplicationId: applicationId,
      scheduledAtLocal: "",
      durationMinutes: 30,
      mode: "Video",
      locationOrLink: "",
    });
    this.scheduleOpen.set(true);
  }

  closeSchedule(): void {
    this.scheduleOpen.set(false);
  }

  submitSchedule(): void {
    if (this.scheduleForm.invalid) {
      this.notifications.error(
        null,
        "Select an applicant and a future date and time.",
      );
      return;
    }
    this.savingSchedule.set(true);
    const value = this.scheduleForm.getRawValue();
    const request: CreateInterviewRequest = {
      jobApplicationId: value.jobApplicationId,
      scheduledAtUtc: new Date(value.scheduledAtLocal).toISOString(),
      durationMinutes: value.durationMinutes,
      mode: value.mode as InterviewMode,
      locationOrLink: value.locationOrLink.trim() || null,
    };
    this.api
      .createInterview(request)
      .pipe(finalize(() => this.savingSchedule.set(false)))
      .subscribe({
        next: (interview) => {
          this.interviews.update((list) => [interview, ...list]);
          this.closeSchedule();
          this.notifications.success("Interview scheduled.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to schedule the interview."),
      });
  }

  openReschedule(interview: RecruiterInterview): void {
    this.rescheduleId.set(interview.id);
    this.rescheduleForm.reset({
      scheduledAtLocal: this.toLocalInput(interview.scheduledAtUtc),
      durationMinutes: interview.durationMinutes,
      mode: interview.mode,
      locationOrLink: interview.locationOrLink ?? "",
    });
  }

  closeReschedule(): void {
    this.rescheduleId.set(null);
  }

  submitReschedule(): void {
    const id = this.rescheduleId();
    if (!id || this.rescheduleForm.invalid) {
      this.notifications.error(null, "Pick a future date and time to reschedule.");
      return;
    }
    this.savingReschedule.set(true);
    const value = this.rescheduleForm.getRawValue();
    const request: UpdateInterviewRequest = {
      scheduledAtUtc: new Date(value.scheduledAtLocal).toISOString(),
      durationMinutes: value.durationMinutes,
      mode: value.mode as InterviewMode,
      locationOrLink: value.locationOrLink.trim() || null,
    };
    this.api
      .updateInterview(id, request)
      .pipe(finalize(() => this.savingReschedule.set(false)))
      .subscribe({
        next: (updated) => {
          this.interviews.update((list) =>
            list.map((interview) =>
              interview.id === updated.id ? updated : interview,
            ),
          );
          this.closeReschedule();
          this.notifications.success("Interview rescheduled.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to reschedule the interview."),
      });
  }

  openFeedback(interview: RecruiterInterview): void {
    this.feedbackId.set(interview.id);
    this.feedbackForm.reset({
      rating: interview.rating ?? 5,
      strengths: interview.strengths ?? "",
      weaknesses: interview.weaknesses ?? "",
      recommendation: interview.recommendation ?? "Consider",
    });
  }

  closeFeedback(): void {
    this.feedbackId.set(null);
  }

  submitFeedback(): void {
    const id = this.feedbackId();
    if (!id || this.feedbackForm.invalid) {
      this.notifications.error(
        null,
        "Provide a rating and a recommendation to save feedback.",
      );
      return;
    }
    this.savingFeedback.set(true);
    const value = this.feedbackForm.getRawValue();
    const request: SubmitFeedbackRequest = {
      rating: value.rating,
      strengths: value.strengths.trim() || null,
      weaknesses: value.weaknesses.trim() || null,
      recommendation: value.recommendation as Recommendation,
    };
    this.api
      .submitFeedback(id, request)
      .pipe(finalize(() => this.savingFeedback.set(false)))
      .subscribe({
        next: (updated) => {
          this.interviews.update((list) =>
            list.map((interview) =>
              interview.id === updated.id ? updated : interview,
            ),
          );
          this.closeFeedback();
          this.notifications.success("Interview feedback saved.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to save the feedback."),
      });
  }

  cancelInterview(interview: RecruiterInterview): void {
    if (this.confirmingCancelId() !== interview.id) {
      this.confirmingCancelId.set(interview.id);
      return;
    }
    this.confirmingCancelId.set(null);
    this.cancellingId.set(interview.id);
    this.api
      .cancelInterview(interview.id)
      .pipe(finalize(() => this.cancellingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.interviews.update((list) =>
            list.map((item) => (item.id === updated.id ? updated : item)),
          );
          this.notifications.success("Interview cancelled.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to cancel the interview."),
      });
  }

  completeInterview(interview: RecruiterInterview): void {
    if (this.confirmingCompleteId() !== interview.id) {
      this.confirmingCompleteId.set(interview.id);
      return;
    }
    this.confirmingCompleteId.set(null);
    this.completingId.set(interview.id);
    this.api
      .completeInterview(interview.id)
      .pipe(finalize(() => this.completingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.interviews.update((list) =>
            list.map((item) => (item.id === updated.id ? updated : item)),
          );
          this.notifications.success("Interview marked as completed.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to complete the interview."),
      });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  badgeClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }

  private toLocalInput(utc: string): string {
    const date = new Date(utc);
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
