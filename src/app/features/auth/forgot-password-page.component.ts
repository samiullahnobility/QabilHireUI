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
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  standalone: true,
  selector: "app-forgot-password-page",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./forgot-password-page.component.html",
  styleUrl: "./forgot-password-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  readonly submitting = signal(false);
  readonly submitAttempted = signal(false);
  form = new FormBuilder().nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.auth
      .forgotPassword(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          if (response.emailEnabled === false)
            this.notifications.warning(response.message);
          else this.notifications.success(response.message);
          this.submitAttempted.set(false);
        },
        error: (error) =>
          this.notifications.error(
            error,
            "Unable to request a password-reset link.",
          ),
      });
  }
}
