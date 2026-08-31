import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { RecruiterApiService } from "./recruiter-api.service";
import { RecruiterDashboard } from "./recruiter.models";

@Component({
  standalone: true,
  selector: "app-recruiter-dashboard-page",
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: "./recruiter-dashboard-page.component.html",
  styleUrl: "./recruiter.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterDashboardPageComponent {
  private readonly api = inject(RecruiterApiService);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly dashboard = signal<RecruiterDashboard | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .dashboard()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (dashboard) => this.dashboard.set(dashboard),
        error: (error) =>
          this.notifications.error(error, "Unable to load your dashboard."),
      });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  stageClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
