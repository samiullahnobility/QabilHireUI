import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminSummary } from "./admin.models";

@Component({
  standalone: true,
  selector: "app-admin-dashboard-page",
  imports: [RouterLink],
  template: `
    <main class="admin-surface">
      @if (loading()) {
        <p class="state-note">Loading platform overview...</p>
      } @else { @if (summary(); as data) {
        <section class="metric-grid" aria-label="Platform summary">
          <article class="metric"><span>Total users</span><strong>{{ data.totalUsers }}</strong></article>
          <article class="metric"><span>Candidates</span><strong>{{ data.candidates }}</strong></article>
          <article class="metric"><span>Recruiters</span><strong>{{ data.recruiters }}</strong></article>
          <article class="metric"><span>Active jobs</span><strong>{{ data.activeJobs }}</strong></article>
          <article class="metric"><span>Applications</span><strong>{{ data.applications }}</strong></article>
          <article class="metric"><span>Completed interviews</span><strong>{{ data.completedInterviews }}</strong></article>
          <article class="metric"><span>Locked accounts</span><strong>{{ data.lockedAccounts }}</strong></article>
          <article class="metric"><span>Administrators</span><strong>{{ data.admins }}</strong></article>
        </section>
        <section class="panel-grid">
          <article class="panel">
            <div class="panel-head"><h2>Recent activity</h2><a routerLink="/app/admin/activity">View all</a></div>
            <ul class="activity-list">
              @for (item of data.recentActivity; track item.occurredAtUtc + item.detail) {
                <li><div><strong>{{ item.title }}</strong><small>{{ item.detail }} · {{ formatDate(item.occurredAtUtc) }}</small></div><span class="activity-type">{{ item.type }}</span></li>
              } @empty { <li class="empty">No platform activity yet.</li> }
            </ul>
          </article>
          <article class="panel">
            <div class="panel-head"><h2>Administration</h2></div>
            <nav class="quick-links" aria-label="Admin quick links">
              <a routerLink="/app/admin/users"><span>Manage users</span><span>›</span></a>
              <a routerLink="/app/admin/jobs"><span>Moderate jobs</span><span>›</span></a>
              <a routerLink="/app/admin/health"><span>Check system health</span><span>›</span></a>
              <a routerLink="/app/admin/reports"><span>Open reports</span><span>›</span></a>
            </nav>
          </article>
        </section>
      } }
    </main>
  `,
  styleUrl: "./admin-operations.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPageComponent {
  private readonly api = inject(AdminApiService);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly summary = signal<AdminSummary | null>(null);

  constructor() {
    this.api.summary().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (summary) => this.summary.set(summary),
      error: (error) => this.notifications.error(error, "Unable to load the admin dashboard."),
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
}
