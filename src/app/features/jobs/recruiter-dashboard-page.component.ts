import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { JobsApiService } from "./jobs-api.service";
import { Applicant, RecruiterJobPosting } from "./jobs.models";

@Component({
  standalone: true,
  selector: "app-recruiter-dashboard-page",
  imports: [FormsModule, MatButtonModule],
  templateUrl: "./recruiter-dashboard-page.component.html",
  styleUrl: "./recruiter-dashboard-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterDashboardPageComponent {
  private readonly api = inject(JobsApiService);
  private readonly notifications = inject(NotificationService);
  readonly postings = signal<RecruiterJobPosting[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);
  readonly applicantsFor = signal<{ id: string; applicants: Applicant[] } | null>(null);
  readonly loadingApplicants = signal(false);
  form = this.emptyForm();

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .recruiterJobs()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (postings) => this.postings.set(postings),
        error: (error) =>
          this.notifications.error(error, "Unable to load your job postings."),
      });
  }

  emptyForm() {
    return {
      title: "",
      company: "",
      location: "",
      workType: "Remote" as "Remote" | "Hybrid" | "Onsite",
      salaryRange: "",
      description: "",
      requiredSkills: "",
    };
  }

  openCreate(): void {
    this.form = this.emptyForm();
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(posting: RecruiterJobPosting): void {
    this.form = {
      title: posting.title,
      company: posting.company,
      location: posting.location ?? "",
      workType: posting.workType,
      salaryRange: posting.salaryRange ?? "",
      description: posting.description,
      requiredSkills: posting.requiredSkills.join(", "),
    };
    this.editingId.set(posting.id);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  save(): void {
    if (!this.form.title.trim() || !this.form.company.trim() || this.form.description.trim().length < 40) {
      this.notifications.error(null, "Title, company, and a description of at least 40 characters are required.");
      return;
    }
    this.saving.set(true);
    const request = {
      title: this.form.title.trim(),
      company: this.form.company.trim(),
      location: this.form.location.trim() || null,
      workType: this.form.workType,
      salaryRange: this.form.salaryRange.trim() || null,
      description: this.form.description.trim(),
      requiredSkills: this.form.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    const editingId = this.editingId();
    const operation = editingId
      ? this.api.recruiterUpdate(editingId, { ...request, isActive: this.currentIsActive() })
      : this.api.recruiterCreate(request);
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (posting) => {
        this.notifications.success(editingId ? "Job posting updated." : "Job posting published.");
        this.showForm.set(false);
        this.editingId.set(null);
        this.postings.update((items) => {
          const rest = items.filter((item) => item.id !== posting.id);
          return [posting, ...rest];
        });
      },
      error: (error) =>
        this.notifications.error(error, "Unable to save the job posting."),
    });
  }

  private currentIsActive(): boolean {
    const current = this.postings().find((item) => item.id === this.editingId());
    return current?.isActive ?? true;
  }

  toggleActive(posting: RecruiterJobPosting): void {
    this.api
      .recruiterUpdate(posting.id, {
        title: posting.title,
        company: posting.company,
        location: posting.location,
        workType: posting.workType,
        salaryRange: posting.salaryRange,
        description: posting.description,
        requiredSkills: posting.requiredSkills,
        isActive: !posting.isActive,
      })
      .subscribe({
        next: (updated) =>
          this.postings.update((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          ),
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
    this.api.recruiterDelete(id).subscribe({
      next: () => {
        this.notifications.success("Job posting deleted.");
        this.postings.update((items) => items.filter((item) => item.id !== id));
      },
      error: (error) =>
        this.notifications.error(error, "Unable to delete the posting."),
    });
  }

  toggleApplicants(id: string): void {
    if (this.applicantsFor()?.id === id) {
      this.applicantsFor.set(null);
      return;
    }
    this.loadingApplicants.set(true);
    this.api
      .applicants(id)
      .pipe(finalize(() => this.loadingApplicants.set(false)))
      .subscribe({
        next: (applicants) => this.applicantsFor.set({ id, applicants }),
        error: (error) =>
          this.notifications.error(error, "Unable to load applicants."),
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
