import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  standalone: true,
  selector: "app-register-page",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./register-page.component.html",
  styleUrl: "./register-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly submitAttempted = signal(false);
  readonly legalDocument = signal<"terms" | "privacy" | null>(null);
  form = new FormBuilder().nonNullable.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
    terms: [false, Validators.requiredTrue],
  });

  openLegal(document: "terms" | "privacy"): void {
    this.legalDocument.set(document);
  }
  closeLegal(): void {
    this.legalDocument.set(null);
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.notifications.error(null, "Passwords do not match.");
      return;
    }

    this.submitting.set(true);
    this.auth
      .register({
        fullName: value.name,
        email: value.email,
        password: value.password,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          const message =
            response.message ?? "Your QabilHire account has been created.";
          if (response.emailEnabled === false)
            this.notifications.warning(message);
          else this.notifications.success(message);
          this.submitAttempted.set(false);
          void this.router.navigateByUrl("/onboarding/profile");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to create your account."),
      });
  }
}
