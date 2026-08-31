import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  standalone: true,
  selector: "app-login-page",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly submitAttempted = signal(false);
  form = new FormBuilder().nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.notifications.success("Welcome back to QabilHire.");
          this.submitAttempted.set(false);
          void this.router.navigateByUrl(this.auth.homeUrl(response.user));
        },
        error: (error) => this.notifications.error(error, "Unable to sign in."),
      });
  }
}
