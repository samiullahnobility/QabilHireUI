import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordPageComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  form = new FormBuilder().nonNullable.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');
    const value = this.form.getRawValue();
    if (!email || !token) {
      this.notifications.error(null, 'This password-reset link is invalid or incomplete.');
      return;
    }
    if (value.password !== value.confirmPassword) {
      this.notifications.error(null, 'Passwords do not match.');
      return;
    }

    this.submitting.set(true);
    this.auth.resetPassword({ email, token, newPassword: value.password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.notifications.success('Your password has been reset. You can now sign in.');
          void this.router.navigateByUrl('/auth/login');
        },
        error: error => this.notifications.error(error, 'Unable to reset your password.')
      });
  }
}
