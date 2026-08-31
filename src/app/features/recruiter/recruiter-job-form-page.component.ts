import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import { RecruiterJobPosting } from "./recruiter.models";

@Component({
  standalone: true,
  selector: "app-recruiter-job-form-page",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: "./recruiter-job-form-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterJobFormPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly posting = signal<RecruiterJobPosting | null>(null);
  readonly workTypes = ["Remote", "Hybrid", "Onsite"];
  submitted = false;

  form = this.fb.nonNullable.group({
    title: ["", [Validators.required, Validators.maxLength(160)]],
    company: ["", [Validators.required, Validators.maxLength(160)]],
    location: ["", Validators.maxLength(120)],
    workType: ["Remote", [Validators.required]],
    salaryRange: ["", Validators.maxLength(80)],
    description: [
      "",
      [Validators.required, Validators.minLength(40), Validators.maxLength(12000)],
    ],
    requiredSkills: [""],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.editingId.set(id);
      this.loadPosting(id);
    }
  }

  loadPosting(id: string): void {
    this.loading.set(true);
    this.api
      .job(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (posting) => {
          this.posting.set(posting);
          this.form.patchValue({
            title: posting.title,
            company: posting.company,
            location: posting.location ?? "",
            workType: posting.workType,
            salaryRange: posting.salaryRange ?? "",
            description: posting.description,
            requiredSkills: posting.requiredSkills.join(", "),
          });
        },
        error: (error) => {
          this.notifications.error(error, "Unable to load the job posting.");
          void this.router.navigateByUrl("/app/recruiter/jobs");
        },
      });
  }

  save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.notifications.error(
        null,
        "Please fix the highlighted fields before saving.",
      );
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    const request = {
      title: value.title.trim(),
      company: value.company.trim(),
      location: value.location.trim() || null,
      workType: value.workType as "Remote" | "Hybrid" | "Onsite",
      salaryRange: value.salaryRange.trim() || null,
      description: value.description.trim(),
      requiredSkills: value.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    const editingId = this.editingId();
    const operation = editingId
      ? this.api.updateJob(editingId, {
          ...request,
          isActive: this.currentIsActive(),
        })
      : this.api.createJob(request);
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.notifications.success(
          editingId
            ? "Job posting updated."
            : "Job posting published and is now live.",
        );
        void this.router.navigateByUrl("/app/recruiter/jobs");
      },
      error: (error) =>
        this.notifications.error(error, "Unable to save the job posting."),
    });
  }

  private currentIsActive(): boolean {
    return this.posting()?.isActive ?? true;
  }
}
