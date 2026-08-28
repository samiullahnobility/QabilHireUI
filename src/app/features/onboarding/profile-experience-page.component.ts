import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ProfileDraftService } from "./profile-draft.service";

@Component({
  standalone: true,
  selector: "app-profile-experience-page",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./profile-experience-page.component.html",
  styleUrl: "./profile-setup.shared.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileExperiencePageComponent {
  private readonly draft = inject(ProfileDraftService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  submitAttempted = false;
  readonly form = this.fb.nonNullable.group({
    qualification: [
      this.draft.value().qualification || this.draft.value().education,
      Validators.required,
    ],
    institution: [this.draft.value().institution, Validators.required],
    graduationYear: [this.draft.value().graduationYear, Validators.required],
    company: [this.draft.value().company, Validators.required],
    currentRole: [this.draft.value().currentRole, Validators.required],
    experienceDuration: [
      this.draft.value().experienceDuration,
      Validators.required,
    ],
    achievement: [this.draft.value().achievement, Validators.required],
  });
  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
  back(): void {
    const value = this.form.getRawValue();
    this.draft.update({ ...value, responsibilities: value.achievement });
    this.form.markAsPristine();
    void this.router.navigateByUrl("/onboarding/profile");
  }
  submit(): void {
    this.submitAttempted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.draft.update({ ...value, responsibilities: value.achievement });
    this.form.markAsPristine();
    this.submitAttempted = false;
    void this.router.navigateByUrl("/onboarding/profile/education");
  }
}
