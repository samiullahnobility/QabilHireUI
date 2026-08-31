import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminReports } from "./admin.models";

@Component({ standalone: true, selector: "app-reports-analytics-page", template: `
  <main class="admin-surface">@if (loading()) { <p class="state-note">Loading reports...</p> } @else { @if (reports(); as data) { <section class="metric-grid"><article class="metric"><span>Resumes</span><strong>{{ data.totalResumes }}</strong></article><article class="metric"><span>Analyzed resumes</span><strong>{{ data.analyzedResumes }}</strong></article><article class="metric"><span>Job matches</span><strong>{{ data.jobMatches }}</strong></article><article class="metric"><span>Applications per job</span><strong>{{ data.applicationPerJobRate }}</strong></article><article class="metric"><span>Interview sessions</span><strong>{{ data.interviewSessions }}</strong></article><article class="metric"><span>Completed interviews</span><strong>{{ data.completedInterviews }}</strong></article><article class="metric"><span>Completion rate</span><strong>{{ completionRate() }}%</strong></article><article class="metric"><span>Improvement plans</span><strong>{{ data.improvementPlans }}</strong></article></section>
  <section class="panel"><div class="panel-head"><h2>Last 14 days</h2><span class="muted">Registrations, jobs, and applications</span></div><div class="trend" aria-label="Fourteen-day activity chart">@for (point of data.trend; track point.date) { <div class="trend-day" [title]="tooltip(point)"><div class="bars"><span class="bar" [style.height.%]="height(point.registrations)"></span><span class="bar jobs" [style.height.%]="height(point.jobs)"></span><span class="bar apps" [style.height.%]="height(point.applications)"></span></div><small>{{ shortDate(point.date) }}</small></div> }</div><div class="legend"><span>Registrations</span><span class="jobs">Jobs</span><span class="apps">Applications</span></div></section> } }</main>`, styleUrl: "./admin-operations.css", changeDetection: ChangeDetectionStrategy.OnPush })
export class ReportsAnalyticsPageComponent {
  private readonly api = inject(AdminApiService); private readonly notifications = inject(NotificationService);
  readonly reports = signal<AdminReports | null>(null); readonly loading = signal(true);
  readonly maxValue = computed(() => Math.max(1, ...(this.reports()?.trend.flatMap((x) => [x.registrations, x.jobs, x.applications]) ?? [1])));
  readonly completionRate = computed(() => { const data = this.reports(); return !data?.interviewSessions ? 0 : Math.round(data.completedInterviews / data.interviewSessions * 100); });
  constructor() { this.api.reports().pipe(finalize(() => this.loading.set(false))).subscribe({ next: (reports) => this.reports.set(reports), error: (error) => this.notifications.error(error, "Unable to load reports.") }); }
  height(value: number): number { return value === 0 ? 1 : Math.max(8, value / this.maxValue() * 100); }
  shortDate(value: string): string { return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
  tooltip(point: { date: string; registrations: number; jobs: number; applications: number }): string { return `${point.date}: ${point.registrations} registrations, ${point.jobs} jobs, ${point.applications} applications`; }
}
