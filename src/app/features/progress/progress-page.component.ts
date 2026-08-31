import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { InterviewApiService } from "../interviews/interview-api.service";
import { ImprovementPlan, ImprovementPlanItem } from "../interviews/interview.models";

@Component({
  standalone: true,
  selector: "app-progress-page",
  imports: [RouterLink, MatButtonModule],
  templateUrl: "./progress-page.component.html",
  styleUrl: "./progress-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPageComponent {
  private readonly api = inject(InterviewApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);
  readonly plan = signal<ImprovementPlan | null>(null);
  readonly loading = signal(true);
  readonly hasPlan = signal(true);
  readonly toggling = signal<string | null>(null);
  readonly todayItem = computed(
    () => this.plan()?.items.find((item) => item.isToday) ?? null,
  );
  readonly progressPercent = computed(() => {
    const plan = this.plan();
    if (!plan || plan.items.length === 0) return 0;
    return Math.round((plan.completedCount / plan.items.length) * 100);
  });
  constructor() {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    const sessionId = this.route.snapshot.queryParamMap.get("session");
    const request = sessionId
      ? this.api.improvementPlanForSession(sessionId)
      : this.api.improvementPlanLatest();
    request
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (plan) => this.plan.set(plan),
        error: (error) => {
          if (error?.status === 404) {
            this.hasPlan.set(false);
            return;
          }
          this.notifications.error(
            error,
            "Unable to load your improvement plan.",
          );
        },
      });
  }
  startToday(): void {
    const item = this.todayItem();
    if (!item) return;
    void this.router.navigate(
      item.title.toLowerCase().includes("mock interview")
        ? ["/app/interviews/setup"]
        : ["/app/interviews", this.plan()!.sessionId, "results"],
    );
  }
  toggle(item: ImprovementPlanItem): void {
    const plan = this.plan();
    if (!plan || this.toggling()) return;
    this.toggling.set(item.day.toString());
    this.api
      .setImprovementPlanItemCompleted(plan.id, item.id, !item.isCompleted)
      .pipe(finalize(() => this.toggling.set(null)))
      .subscribe({
        next: (updated) => {
          const current = this.plan();
          if (!current) return;
          const updatedItems = current.items.map((entry) =>
            entry.day === updated.day ? updated : entry,
          );
          this.plan.set({
            ...current,
            completedCount: updatedItems.filter((entry) => entry.isCompleted)
              .length,
            items: updatedItems,
          });
        },
        error: (error) =>
          this.notifications.error(
            error,
            "Unable to update the activity. Please try again.",
          ),
      });
  }
}
