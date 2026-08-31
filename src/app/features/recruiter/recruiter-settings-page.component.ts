import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import { RecruiterProfile } from "./recruiter.models";

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get("newPassword")?.value as string;
  const confirm = group.get("confirmPassword")?.value as string;
  if (password && confirm && password !== confirm) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  standalone: true,
  selector: "app-recruiter-settings-page",
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./recruiter-settings-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterSettingsPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly user = this.auth.currentUser;
  readonly loading = signal(true);
  readonly savingProfile = signal(false);
  readonly savingNotifications = signal(false);
  readonly changingPassword = signal(false);
  readonly profile = signal<RecruiterProfile | null>(null);

  profileForm = this.fb.nonNullable.group({
    fullName: ["", [Validators.required, Validators.maxLength(160)]],
    organization: ["", Validators.maxLength(160)],
  });

  notificationsForm = this.fb.nonNullable.group({
    emailNotifications: [true],
    pipelineUpdateNotifications: [true],
    interviewReminderNotifications: [true],
  });

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ["", Validators.required],
      newPassword: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
      ],
      confirmPassword: ["", Validators.required],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    this.api
      .profile()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.profileForm.patchValue({
            fullName: profile.fullName,
            organization: profile.organization ?? "",
          });
          this.notificationsForm.patchValue({
            emailNotifications: profile.emailNotifications,
            pipelineUpdateNotifications: profile.pipelineUpdateNotifications,
            interviewReminderNotifications:
              profile.interviewReminderNotifications,
          });
        },
        error: (error) =>
          this.notifications.error(error, "Unable to load your profile."),
      });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.notifications.error(null, "Please provide your full name.");
      return;
    }
    this.savingProfile.set(true);
    const value = this.profileForm.getRawValue();
    this.api
      .updateProfile({
        fullName: value.fullName.trim(),
        organization: value.organization.trim() || null,
        ...this.notificationFlags(),
      })
      .pipe(finalize(() => this.savingProfile.set(false)))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.auth.loadCurrentUser().subscribe();
          this.notifications.success("Profile updated.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to update your profile."),
      });
  }

  saveNotifications(): void {
    const profile = this.profile();
    if (!profile) return;
    this.savingNotifications.set(true);
    this.api
      .updateProfile({
        fullName: profile.fullName,
        organization: profile.organization,
        ...this.notificationFlags(),
      })
      .pipe(finalize(() => this.savingNotifications.set(false)))
      .subscribe({
        next: (updated) => {
          this.profile.set(updated);
          this.notifications.success("Notification preferences saved.");
        },
        error: (error) =>
          this.notifications.error(
            error,
            "Unable to save notification preferences.",
          ),
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.notifications.error(
        null,
        "New password must be at least 8 characters and match the confirmation.",
      );
      return;
    }
    this.changingPassword.set(true);
    const value = this.passwordForm.getRawValue();
    this.auth
      .changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })
      .pipe(finalize(() => this.changingPassword.set(false)))
      .subscribe({
        next: (response) => {
          this.passwordForm.reset();
          this.notifications.success(response.message || "Password changed.");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to change your password."),
      });
  }

  private notificationFlags(): {
    emailNotifications: boolean;
    pipelineUpdateNotifications: boolean;
    interviewReminderNotifications: boolean;
  } {
    return this.notificationsForm.getRawValue();
  }
}
