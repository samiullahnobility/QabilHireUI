import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminUser } from "../jobs/jobs.models";

@Component({
  standalone: true,
  selector: "app-user-management-page",
  imports: [FormsModule, MatButtonModule],
  templateUrl: "./user-management-page.component.html",
  styleUrl: "./user-management-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent {
  private readonly api = inject(AdminApiService);
  private readonly notifications = inject(NotificationService);
  readonly users = signal<AdminUser[]>([]);
  readonly loading = signal(true);
  readonly savingId = signal<string | null>(null);
  readonly roles = ["Candidate", "Recruiter", "Admin"];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .users()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => this.users.set(users),
        error: (error) => this.notifications.error(error, "Unable to load users."),
      });
  }

  changeRole(user: AdminUser, role: string): void {
    if (user.roles.includes(role)) return;
    this.savingId.set(user.id);
    this.api
      .updateRole(user.id, role)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: () => {
          this.notifications.success(`Role updated for ${user.fullName}.`);
          this.users.update((items) =>
            items.map((item) =>
              item.id === user.id ? { ...item, roles: [role] } : item,
            ),
          );
        },
        error: (error) => this.notifications.error(error, "Unable to update the role."),
      });
  }

  toggleLock(user: AdminUser): void {
    this.savingId.set(user.id);
    this.api
      .updateLock(user.id, !user.lockedOut)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: () => {
          this.notifications.success(
            user.lockedOut ? `Unlocked ${user.fullName}.` : `Locked ${user.fullName}.`,
          );
          this.users.update((items) =>
            items.map((item) =>
              item.id === user.id ? { ...item, lockedOut: !item.lockedOut } : item,
            ),
          );
        },
        error: (error) => this.notifications.error(error, "Unable to update the account lock."),
      });
  }

  primaryRole(user: AdminUser): string {
    return user.roles.find((role) => this.roles.includes(role)) ?? "Candidate";
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
