import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminRole } from "../jobs/jobs.models";

@Component({
  standalone: true,
  selector: "app-roles-permissions-page",
  templateUrl: "./roles-permissions-page.component.html",
  styleUrl: "./roles-permissions-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesPermissionsPageComponent {
  private readonly api = inject(AdminApiService);
  private readonly notifications = inject(NotificationService);
  readonly roles = signal<AdminRole[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .roles()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (roles) => this.roles.set(roles),
        error: (error) => this.notifications.error(error, "Unable to load roles."),
      });
  }
}
