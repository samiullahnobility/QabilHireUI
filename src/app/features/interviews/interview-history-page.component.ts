import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { InterviewApiService } from "./interview-api.service";
import { InterviewSession } from "./interview.models";

@Component({
  standalone: true,
  selector: "app-interview-history-page",
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: "./interview-history-page.component.html",
  styleUrl: "./interview-history-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewHistoryPageComponent {
  private readonly api = inject(InterviewApiService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly sessions = signal<InterviewSession[]>([]);
  readonly loading = signal(true);
  readonly generating = signal<string | null>(null);
  readonly search = signal("");
  readonly type = signal("all");
  readonly status = signal("all");
  readonly filteredSessions = computed(() => {
    const query = this.search().trim().toLowerCase();
    const selectedType = this.type();
    const selectedStatus = this.status();
    return this.sessions().filter(
      (item) =>
        (!query || item.targetRole.toLowerCase().includes(query)) &&
        (selectedType === "all" || item.category === selectedType) &&
        (selectedStatus === "all" || item.status === selectedStatus),
    );
  });
  constructor() {
    this.api.list().subscribe({
      next: (items) => {
        this.sessions.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notifications.error(error, "Unable to load your interviews.");
      },
    });
  }
  clearFilters(): void {
    this.search.set("");
    this.type.set("all");
    this.status.set("all");
  }
  actionFor(item: InterviewSession): { label: string; route: string[] } {
    switch (item.status) {
      case "Evaluated":
        return { label: "View results", route: ["/app/interviews", item.id, "results"] };
      case "Completed":
        return { label: "Generate results", route: [] };
      case "InProgress":
        return { label: "Continue interview", route: ["/app/interviews/session", item.id] };
      default:
        return { label: "Start interview", route: ["/app/interviews/session", item.id] };
    }
  }
  open(item: InterviewSession): void {
    const action = this.actionFor(item);
    if (action.route.length) {
      void this.router.navigate(action.route);
      return;
    }
    if (this.generating()) return;
    this.generating.set(item.id);
    this.api
      .evaluate(item.id)
      .pipe(finalize(() => this.generating.set(null)))
      .subscribe({
        next: () =>
          void this.router.navigate(["/app/interviews", item.id, "results"]),
        error: (error) =>
          this.notifications.error(
            error,
            "Evaluation could not be generated. Your answers are safe; please try again.",
          ),
      });
  }
  formatDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }
}
