import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { JobsApiService } from "./jobs-api.service";
import { JobApplication } from "./jobs.models";

@Component({
  standalone: true,
  selector: "app-my-applications-page",
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./my-applications-page.component.html",
  styleUrl: "./my-applications-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyApplicationsPageComponent {
  private readonly api = inject(JobsApiService);
  private readonly notifications = inject(NotificationService);
  readonly applications = signal<JobApplication[]>([]);
  readonly loading = signal(true);
  readonly confirmingId = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api
      .applications()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (applications) => this.applications.set(applications),
        error: (error) =>
          this.notifications.error(error, "Unable to load your applications."),
      });
  }

  requestWithdraw(id: string): void {
    this.confirmingId.set(id);
  }

  cancelWithdraw(): void {
    this.confirmingId.set(null);
  }

  withdraw(id: string, postingId: string): void {
    this.confirmingId.set(null);
    this.api.withdraw(postingId).subscribe({
      next: () => {
        this.notifications.success("Application withdrawn.");
        this.applications.update((items) =>
          items.filter((item) => item.id !== id),
        );
      },
      error: (error) =>
        this.notifications.error(error, "Unable to withdraw the application."),
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
