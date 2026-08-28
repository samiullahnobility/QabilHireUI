import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { JobMatchApiService } from "./job-match-api.service";

@Component({
  standalone: true,
  selector: "app-job-match-input-page",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./job-match-input-page.component.html",
  styleUrl: "./job-match.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobMatchInputPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(JobMatchApiService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly form = this.fb.nonNullable.group({
    targetJobTitle: ["", [Validators.required, Validators.maxLength(160)]],
    company: ["", Validators.maxLength(160)],
    jobDescription: [
      "",
      [
        Validators.required,
        Validators.minLength(40),
        Validators.maxLength(12000),
      ],
    ],
  });
  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const value = this.form.getRawValue();
    this.api
      .create({
        targetJobTitle: value.targetJobTitle,
        company: value.company.trim() || null,
        jobDescription: value.jobDescription,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (match) =>
          void this.router.navigate(["/app/job-match", match.id]),
        error: (error) =>
          this.notifications.error(error, "Unable to analyze this job match."),
      });
  }
}
