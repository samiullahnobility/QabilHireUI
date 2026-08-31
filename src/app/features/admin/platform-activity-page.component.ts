import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminActivity } from "./admin.models";

@Component({ standalone: true, selector: "app-platform-activity-page", imports: [FormsModule], template: `
  <main class="admin-surface"><div class="filters"><input type="search" aria-label="Search activity" placeholder="Search platform activity" [(ngModel)]="query" /><select aria-label="Filter activity type" [(ngModel)]="type"><option value="all">All activity</option><option value="User">Users</option><option value="Job">Jobs</option><option value="Application">Applications</option><option value="Admin">Admin actions</option></select></div>
  @if (loading()) { <p class="state-note">Loading platform activity...</p> } @else { <section class="panel"><div class="panel-head"><h2>Platform activity</h2><span class="muted">{{ filtered().length }} events</span></div><ul class="activity-list">@for (item of filtered(); track item.occurredAtUtc + item.detail) { <li><div><strong>{{ item.title }}</strong><small>{{ item.detail }} · {{ formatDate(item.occurredAtUtc) }}</small></div><span class="activity-type">{{ item.type }}</span></li> } @empty { <li class="empty">No matching activity.</li> }</ul></section> }</main>`, styleUrl: "./admin-operations.css", changeDetection: ChangeDetectionStrategy.OnPush })
export class PlatformActivityPageComponent {
  private readonly api = inject(AdminApiService); private readonly notifications = inject(NotificationService);
  readonly items = signal<AdminActivity[]>([]); readonly loading = signal(true); readonly queryValue = signal(""); readonly typeValue = signal("all");
  get query(): string { return this.queryValue(); } set query(value: string) { this.queryValue.set(value); }
  get type(): string { return this.typeValue(); } set type(value: string) { this.typeValue.set(value); }
  readonly filtered = computed(() => { const q = this.queryValue().trim().toLowerCase(); return this.items().filter((x) => (this.typeValue() === "all" || x.type === this.typeValue()) && (!q || `${x.title} ${x.detail}`.toLowerCase().includes(q))); });
  constructor() { this.api.activity().pipe(finalize(() => this.loading.set(false))).subscribe({ next: (items) => this.items.set(items), error: (error) => this.notifications.error(error, "Unable to load platform activity.") }); }
  formatDate(value: string): string { return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
}
