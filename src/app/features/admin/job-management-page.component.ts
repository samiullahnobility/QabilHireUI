import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { AdminApiService } from "./admin-api.service";
import { AdminJob } from "./admin.models";

@Component({
  standalone: true,
  selector: "app-job-management-page",
  imports: [FormsModule, MatButtonModule],
  template: `
    <main class="admin-surface">
      <div class="filters">
        <input type="search" aria-label="Search jobs" placeholder="Search title, company, or recruiter" [(ngModel)]="query" />
        <select aria-label="Filter job status" [(ngModel)]="status"><option value="all">All jobs</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
      @if (loading()) { <p class="state-note">Loading job postings...</p> }
      @else {
        <section class="panel">
          <div class="panel-head"><h2>Job postings</h2><span class="muted">{{ filteredJobs().length }} results</span></div>
          <div class="table-scroll"><table><thead><tr><th>Job</th><th>Recruiter</th><th>Applications</th><th>Status</th><th>Posted</th><th>Actions</th></tr></thead>
            <tbody>@for (job of filteredJobs(); track job.id) {
              <tr><td><strong>{{ job.title }}</strong><small>{{ job.company }} · {{ job.location || job.workType }}</small></td><td>{{ job.recruiterName }}</td><td>{{ job.applicationCount }}</td><td><span class="status" [class.attention]="!job.isActive">{{ job.isActive ? "Active" : "Inactive" }}</span></td><td>{{ formatDate(job.postedAtUtc) }}</td>
                <td><div class="action-row"><button mat-stroked-button type="button" [disabled]="workingId() === job.id" (click)="toggle(job)">{{ job.isActive ? "Deactivate" : "Activate" }}</button><button mat-button class="danger" type="button" [disabled]="workingId() === job.id" (click)="requestDelete(job)">{{ deleteId() === job.id ? "Confirm delete" : "Delete" }}</button></div></td></tr>
            } @empty { <tr><td colspan="6" class="empty">No jobs match these filters.</td></tr> }</tbody>
          </table></div>
        </section>
      }
    </main>
  `,
  styleUrl: "./admin-operations.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobManagementPageComponent {
  private readonly api = inject(AdminApiService);
  private readonly notifications = inject(NotificationService);
  readonly jobs = signal<AdminJob[]>([]);
  readonly loading = signal(true);
  readonly workingId = signal<string | null>(null);
  readonly deleteId = signal<string | null>(null);
  readonly queryValue = signal("");
  readonly statusValue = signal("all");
  get query(): string { return this.queryValue(); }
  set query(value: string) { this.queryValue.set(value); }
  get status(): string { return this.statusValue(); }
  set status(value: string) { this.statusValue.set(value); }
  readonly filteredJobs = computed(() => {
    const query = this.queryValue().trim().toLowerCase();
    return this.jobs().filter((job) =>
      (this.statusValue() === "all" || (this.statusValue() === "active") === job.isActive) &&
      (!query || `${job.title} ${job.company} ${job.recruiterName}`.toLowerCase().includes(query)),
    );
  });

  constructor() {
    this.api.jobs().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (jobs) => this.jobs.set(jobs),
      error: (error) => this.notifications.error(error, "Unable to load job postings."),
    });
  }

  toggle(job: AdminJob): void {
    this.workingId.set(job.id);
    this.api.updateJobStatus(job.id, !job.isActive).pipe(finalize(() => this.workingId.set(null))).subscribe({
      next: () => this.jobs.update((items) => items.map((item) => item.id === job.id ? { ...item, isActive: !item.isActive } : item)),
      error: (error) => this.notifications.error(error, "Unable to update the job status."),
    });
  }

  requestDelete(job: AdminJob): void {
    if (this.deleteId() !== job.id) { this.deleteId.set(job.id); return; }
    this.workingId.set(job.id);
    this.api.deleteJob(job.id).pipe(finalize(() => { this.workingId.set(null); this.deleteId.set(null); })).subscribe({
      next: () => { this.jobs.update((items) => items.filter((item) => item.id !== job.id)); this.notifications.success("Job posting deleted."); },
      error: (error) => this.notifications.error(error, "Unable to delete the job posting."),
    });
  }

  formatDate(value: string): string { return new Date(value).toLocaleDateString(); }
}
