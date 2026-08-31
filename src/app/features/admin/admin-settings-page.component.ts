import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminSettings } from "./admin.models";

@Component({ standalone: true, selector: "app-admin-settings-page", imports: [ReactiveFormsModule, MatButtonModule], template: `
  <main class="admin-surface">@if (loading()) { <p class="state-note">Loading admin settings...</p> } @else { @if (settings(); as data) { <section class="settings-grid"><article class="panel"><div class="panel-head"><h2>Platform configuration</h2></div><ul class="settings-list"><li><span>Environment</span><strong>{{ data.environment }}</strong></li><li><span>Frontend URL</span><strong>{{ data.frontendUrl || "Not configured" }}</strong></li><li><span>Allowed origins</span><strong>{{ data.allowedOrigins.join(", ") || "None" }}</strong></li><li><span>Email</span><strong>{{ state(data.emailConfigured) }}</strong></li><li><span>AI provider</span><strong>{{ state(data.aiConfigured) }}</strong></li><li><span>File storage</span><strong>{{ state(data.storageConfigured) }}</strong></li></ul></article>
  <article class="panel"><div class="panel-head"><h2>Security and limits</h2></div><ul class="settings-list"><li><span>AI rate limit</span><strong>{{ data.aiPermitLimit }} per {{ data.aiWindowMinutes }} minute(s)</strong></li><li><span>Access token lifetime</span><strong>{{ data.accessTokenMinutes }} minutes</strong></li><li><span>Refresh session lifetime</span><strong>{{ data.refreshTokenDays }} days</strong></li></ul></article>
  <article class="panel"><div class="panel-head"><h2>Change admin password</h2></div><form class="password-form" [formGroup]="form" (ngSubmit)="submit()"><label>Current password<input type="password" autocomplete="current-password" formControlName="currentPassword" /></label><label>New password<input type="password" autocomplete="new-password" formControlName="newPassword" /></label><label>Confirm new password<input type="password" autocomplete="new-password" formControlName="confirmPassword" /></label>@if (mismatch()) { <p class="danger">New passwords do not match.</p> }<button mat-flat-button type="submit" [disabled]="form.invalid || mismatch() || saving()">{{ saving() ? "Updating..." : "Update password" }}</button></form></article>
  <article class="panel"><div class="panel-head"><h2>Configuration policy</h2></div><div class="password-form"><p class="muted">Provider credentials and production limits are managed through Railway environment variables. Secret values are intentionally never returned to this screen.</p></div></article></section> } }</main>`, styleUrl: "./admin-operations.css", changeDetection: ChangeDetectionStrategy.OnPush })
export class AdminSettingsPageComponent {
  private readonly api = inject(AdminApiService); private readonly auth = inject(AuthService); private readonly notifications = inject(NotificationService); private readonly router = inject(Router);
  readonly settings = signal<AdminSettings | null>(null); readonly loading = signal(true); readonly saving = signal(false);
  readonly form = new FormBuilder().nonNullable.group({ currentPassword: ["", Validators.required], newPassword: ["", [Validators.required, Validators.minLength(8)]], confirmPassword: ["", Validators.required] });
  constructor() { this.api.settings().pipe(finalize(() => this.loading.set(false))).subscribe({ next: (settings) => this.settings.set(settings), error: (error) => this.notifications.error(error, "Unable to load admin settings.") }); }
  mismatch(): boolean { const value = this.form.getRawValue(); return !!value.confirmPassword && value.newPassword !== value.confirmPassword; }
  state(configured: boolean): string { return configured ? "Configured" : "Needs attention"; }
  submit(): void { if (this.form.invalid || this.mismatch() || this.saving()) return; const value = this.form.getRawValue(); this.saving.set(true); this.auth.changePassword({ currentPassword: value.currentPassword, newPassword: value.newPassword }).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.form.reset(); this.auth.clearLocalSession(); this.notifications.success("Password changed. Sign in again with your new password."); void this.router.navigateByUrl("/auth/login"); }, error: (error) => this.notifications.error(error, "Unable to change the password.") }); }
}
