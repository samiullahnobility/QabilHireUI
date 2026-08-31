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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  standalone: true,
  selector: "app-reset-password-page",
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./reset-password-page.component.html",
  styleUrl: "./reset-password-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly submitAttempted = signal(false);
  form = new FormBuilder().nonNullable.group(
    {
      password: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
      ],
      confirmPassword: ["", Validators.required],
    },
    { validators: this.passwordsMatch },
  );

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }

    const email = this.route.snapshot.queryParamMap.get("email");
    const token = this.route.snapshot.queryParamMap.get("token");
    const value = this.form.getRawValue();
    if (!email || !token) {
      this.notifications.error(
        null,
        "This password-reset link is invalid or incomplete.",
      );
      return;
    }

    this.submitting.set(true);
    this.auth
      .resetPassword({ email, token, newPassword: value.password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          if (response.emailEnabled === false)
            this.notifications.warning(response.message);
          else this.notifications.success(response.message);
          this.submitAttempted.set(false);
          void this.router.navigateByUrl("/auth/login");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to reset your password."),
      });
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get("password")?.value;
    const confirm = group.get("confirmPassword")?.value;
    return password && confirm && password !== confirm
      ? { mismatch: true }
      : null;
  }
}
