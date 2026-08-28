import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { ProfileDraftService } from "../onboarding/profile-draft.service";
import { InterviewApiService } from "./interview-api.service";

@Component({
  standalone: true,
  selector: "app-interview-setup-page",
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./interview-setup-page.component.html",
  styleUrl: "./interview.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewSetupPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(InterviewApiService);
  private readonly profile = inject(ProfileDraftService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly categories = [
    "HR",
    "Technical",
    "Behavioral",
    "Project-based",
    "Mixed",
  ];
  readonly difficulties = ["Beginner", "Intermediate", "Advanced"];
  readonly modes = ["Practice", "Realistic"];
  readonly responseModes = ["Voice", "Text"];
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly form = this.fb.nonNullable.group({
    targetRole: ["", [Validators.required, Validators.maxLength(120)]],
    category: ["Technical", Validators.required],
    difficulty: ["Intermediate", Validators.required],
    mode: ["Practice", Validators.required],
    responseMode: ["Voice", Validators.required],
  });

  constructor() {
    this.profile.load().subscribe({
      next: (value) => this.form.controls.targetRole.setValue(value.targetRole),
      error: (error) =>
        this.notifications.error(error, "Unable to load your target role."),
    });
  }

  choose(
    control: "category" | "difficulty" | "mode" | "responseMode",
    value: string,
  ): void {
    this.form.controls[control].setValue(value);
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.api
      .create(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (session) =>
          void this.router.navigate(["/app/interviews/session", session.id]),
        error: (error) =>
          this.notifications.error(error, "Unable to generate your interview."),
      });
  }
}
