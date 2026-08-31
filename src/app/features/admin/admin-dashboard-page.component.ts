import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminSummary } from "./admin.models";

@Component({
  standalone: true,
  selector: "app-admin-dashboard-page",
  imports: [RouterLink, MatIconModule],
  template: `
    <main class="admin-surface">
      @if (loading()) {
        <p class="state-note">Loading platform overview...</p>
      } @else { @if (summary(); as data) {
        <section class="dashboard-hero">
          <div class="hero-copy">
            <span class="hero-kicker">Admin control center</span>
            <h1>Platform operations at a glance</h1>
            <p>Track user activity, hiring demand, account risk, and interview progress from one focused workspace.</p>
          </div>
          <div class="hero-aside">
            <article class="hero-stat">
              <div class="hero-stat-icon users"><mat-icon>groups</mat-icon></div>
              <div><span>Live user base</span><strong>{{ data.totalUsers }}</strong></div>
            </article>
            <article class="hero-stat">
              <div class="hero-stat-icon jobs"><mat-icon>work</mat-icon></div>
              <div><span>Open hiring demand</span><strong>{{ data.activeJobs }}</strong></div>
            </article>
          </div>
        </section>

        <section class="metric-grid" aria-label="Platform summary">
          <article class="metric accent-users">
            <div class="metric-top"><div class="metric-icon"><mat-icon>groups</mat-icon></div><span>Total users</span></div>
            <strong>{{ data.totalUsers }}</strong>
            <small>All registered accounts across the platform</small>
          </article>
          <article class="metric accent-candidates">
            <div class="metric-top"><div class="metric-icon"><mat-icon>person_search</mat-icon></div><span>Candidates</span></div>
            <strong>{{ data.candidates }}</strong>
            <small>Users progressing through preparation workflows</small>
          </article>
          <article class="metric accent-recruiters">
            <div class="metric-top"><div class="metric-icon"><mat-icon>badge</mat-icon></div><span>Recruiters</span></div>
            <strong>{{ data.recruiters }}</strong>
            <small>Hiring-side accounts managing openings</small>
          </article>
          <article class="metric accent-jobs">
            <div class="metric-top"><div class="metric-icon"><mat-icon>work</mat-icon></div><span>Active jobs</span></div>
            <strong>{{ data.activeJobs }}</strong>
            <small>Listings currently available to candidates</small>
          </article>
          <article class="metric accent-applications">
            <div class="metric-top"><div class="metric-icon"><mat-icon>assignment_turned_in</mat-icon></div><span>Applications</span></div>
            <strong>{{ data.applications }}</strong>
            <small>Submitted applications across active roles</small>
          </article>
          <article class="metric accent-interviews">
            <div class="metric-top"><div class="metric-icon"><mat-icon>forum</mat-icon></div><span>Completed interviews</span></div>
            <strong>{{ data.completedInterviews }}</strong>
            <small>Finished mock interview sessions with results</small>
          </article>
          <article class="metric accent-risk">
            <div class="metric-top"><div class="metric-icon"><mat-icon>lock_person</mat-icon></div><span>Locked accounts</span></div>
            <strong>{{ data.lockedAccounts }}</strong>
            <small>Accounts currently under restricted access</small>
          </article>
          <article class="metric accent-admins">
            <div class="metric-top"><div class="metric-icon"><mat-icon>shield_person</mat-icon></div><span>Administrators</span></div>
            <strong>{{ data.admins }}</strong>
            <small>Users with platform governance permissions</small>
          </article>
        </section>

        <section class="dashboard-lower">
          <section class="panel-grid">
            <article class="panel">
              <div class="panel-head">
                <div>
                  <h2>Recent activity</h2>
                  <p>Latest platform and admin events</p>
                </div>
                <a routerLink="/app/admin/activity">View all</a>
              </div>
              <ul class="activity-list">
                @for (item of data.recentActivity; track item.occurredAtUtc + item.detail) {
                  <li>
                    <div class="activity-main">
                      <div class="activity-icon" [class.user]="item.type === 'User'" [class.job]="item.type === 'Job'" [class.application]="item.type === 'Application'" [class.admin]="item.type === 'Admin'">
                        <mat-icon>{{ activityIcon(item.type) }}</mat-icon>
                      </div>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.detail }} | {{ formatDate(item.occurredAtUtc) }}</small>
                      </div>
                    </div>
                    <span class="activity-type" [class.admin]="item.type === 'Admin'">{{ item.type }}</span>
                  </li>
                } @empty { <li class="empty">No platform activity yet.</li> }
              </ul>
            </article>

            <article class="panel quick-actions-panel">
              <div class="panel-head">
                <div>
                  <h2>Administration</h2>
                  <p>Fast access to the main controls</p>
                </div>
              </div>
              <nav class="quick-links" aria-label="Admin quick links">
                <a routerLink="/app/admin/users">
                  <div><mat-icon>manage_accounts</mat-icon><span>Manage users</span></div>
                  <small>Roles, access, and account status</small>
                </a>
                <a routerLink="/app/admin/jobs">
                  <div><mat-icon>rule</mat-icon><span>Moderate jobs</span></div>
                  <small>Review, deactivate, or remove listings</small>
                </a>
                <a routerLink="/app/admin/health">
                  <div><mat-icon>monitor_heart</mat-icon><span>System health</span></div>
                  <small>Service readiness and AI telemetry</small>
                </a>
                <a routerLink="/app/admin/reports">
                  <div><mat-icon>insights</mat-icon><span>Open reports</span></div>
                  <small>Growth, applications, and performance trends</small>
                </a>
              </nav>
            </article>
          </section>

          <section class="spotlight-grid" aria-label="Operational highlights">
            <article class="spotlight-card">
              <div class="spotlight-head"><mat-icon>trending_up</mat-icon><h2>Hiring flow</h2></div>
              <p>{{ data.applications }} applications are moving across {{ data.activeJobs }} active openings.</p>
              <strong>{{ hiringSummary(data) }}</strong>
            </article>
            <article class="spotlight-card warning">
              <div class="spotlight-head"><mat-icon>policy</mat-icon><h2>Risk watch</h2></div>
              <p>{{ data.lockedAccounts }} account{{ data.lockedAccounts === 1 ? "" : "s" }} currently require restricted-access review.</p>
              <strong>{{ governanceSummary(data) }}</strong>
            </article>
          </section>
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

  activityIcon(type: string): string {
    switch (type) {
      case "User": return "person_add";
      case "Job": return "work_history";
      case "Application": return "assignment";
      case "Admin": return "admin_panel_settings";
      default: return "notifications";
    }
  }

  hiringSummary(data: AdminSummary): string {
    if (data.activeJobs === 0) return "No active openings right now";
    return `${Math.round(data.applications / data.activeJobs)} avg applications per active job`;
  }

  governanceSummary(data: AdminSummary): string {
    if (data.admins === 0) return "Admin coverage is not configured";
    return `${data.admins} admin account${data.admins === 1 ? "" : "s"} monitoring the platform`;
  }
}
