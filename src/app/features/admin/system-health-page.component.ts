import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminSystemHealth } from "./admin.models";

@Component({ standalone: true, selector: "app-system-health-page", imports: [MatButtonModule], template: `
  <main class="admin-surface"><div class="admin-toolbar"><div><h2>System health</h2><p>Runtime readiness and AI workload visibility</p></div><button mat-stroked-button type="button" (click)="load()" [disabled]="loading()">Refresh</button></div>
  @if (loading()) { <p class="state-note">Checking services...</p> } @else { @if (health(); as data) { <section class="metric-grid"><article class="metric"><span>Resume analyses</span><strong>{{ data.resumeAnalyses }}</strong></article><article class="metric"><span>Job-match analyses</span><strong>{{ data.jobMatchAnalyses }}</strong></article><article class="metric"><span>Interview evaluations</span><strong>{{ data.interviewEvaluations }}</strong></article><article class="metric"><span>Uptime</span><strong>{{ uptime(data.uptimeSeconds) }}</strong></article></section>
  <section class="panel-grid"><article class="panel"><div class="panel-head"><h2>Services</h2><span class="muted">{{ data.environment }}</span></div><ul class="service-list">@for (service of data.services; track service.name) { <li><div><strong>{{ service.name }}</strong><small>{{ service.detail }}</small></div><span class="status" [class.attention]="service.status !== 'Operational'">{{ service.status }}</span></li> }</ul></article>
  <article class="panel"><div class="panel-head"><h2>AI telemetry</h2></div><ul class="settings-list"><li><span>Average latency</span><strong>{{ data.averageAiLatencyMilliseconds === null ? "Not tracked" : data.averageAiLatencyMilliseconds + " ms" }}</strong></li><li><span>Total requests</span><strong>{{ data.aiRequestCount }}</strong></li><li><span>Provider failures</span><strong>{{ data.aiFailureCount }}</strong></li><li><span>Success rate</span><strong>{{ data.aiSuccessRate === null ? "Not tracked" : data.aiSuccessRate + "%" }}</strong></li><li><span>Last checked</span><strong>{{ formatDate(data.checkedAtUtc) }}</strong></li></ul>@if (data.aiOperations.length) { <ul class="service-list">@for (operation of data.aiOperations; track operation.operation) { <li><div><strong>{{ operation.operation }}</strong><small>{{ operation.requestCount }} requests, {{ operation.failureCount }} failures</small></div><span class="status">{{ operation.averageLatencyMilliseconds }} ms</span></li> }</ul> }</article></section> } }</main>`, styleUrl: "./admin-operations.css", changeDetection: ChangeDetectionStrategy.OnPush })
export class SystemHealthPageComponent {
  private readonly api = inject(AdminApiService); private readonly notifications = inject(NotificationService);
  readonly health = signal<AdminSystemHealth | null>(null); readonly loading = signal(true);
  constructor() { this.load(); }
  load(): void { this.loading.set(true); this.api.health().pipe(finalize(() => this.loading.set(false))).subscribe({ next: (health) => this.health.set(health), error: (error) => this.notifications.error(error, "Unable to check system health.") }); }
  uptime(seconds: number): string { const hours = Math.floor(seconds / 3600); return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`; }
  formatDate(value: string): string { return new Date(value).toLocaleString(); }
}
