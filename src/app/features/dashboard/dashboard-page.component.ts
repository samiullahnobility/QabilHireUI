import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { DashboardApiService } from "./dashboard-api.service";
import { DashboardSummary } from "./dashboard.models";

@Component({
  standalone: true,
  selector: "app-dashboard-page",
  imports: [RouterLink],
  templateUrl: "./dashboard-page.component.html",
  styleUrl: "./dashboard-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly api = inject(DashboardApiService);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly hasTrend = computed(() => (this.summary()?.trend.length ?? 0) > 0);
  readonly hasActivity = computed(
    () => (this.summary()?.recentActivity.length ?? 0) > 0,
  );

  constructor() {
    this.api
      .summary()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (summary) => this.summary.set(summary),
        error: (error) =>
          this.notifications.error(error, "Unable to load your dashboard."),
      });
  }

  formatScore(value: number | null | undefined): string {
    return value == null ? "—" : `${value}%`;
  }

  timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - Date.parse(iso)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return months < 12 ? `${months}mo ago` : `${Math.floor(days / 365)}y ago`;
  }
}
