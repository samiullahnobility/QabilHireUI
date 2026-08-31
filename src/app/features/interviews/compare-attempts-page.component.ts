import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { InterviewApiService } from "./interview-api.service";
import {
  InterviewResult,
  InterviewScores,
  InterviewSession,
} from "./interview.models";

@Component({
  standalone: true,
  selector: "app-compare-attempts-page",
  imports: [
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: "./compare-attempts-page.component.html",
  styleUrl: "./compare-attempts-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareAttemptsPageComponent {
  private readonly api = inject(InterviewApiService);
  readonly sessions = signal<InterviewSession[]>([]);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly leftId = signal("");
  readonly rightId = signal("");
  readonly left = signal<InterviewResult | null>(null);
  readonly right = signal<InterviewResult | null>(null);

  readonly metrics: [keyof InterviewScores, string][] = [
    ["technical", "Technical"],
    ["communication", "Communication"],
    ["confidence", "Confidence"],
    ["relevance", "Relevance"],
    ["problemSolving", "Problem solving"],
    ["professionalism", "Professionalism"],
  ];

  readonly overallDelta = computed(() => this.deltaFor("overall"));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.api
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => {
          const evaluated = items
            .filter((session) => session.status === "Evaluated")
            .sort((a, b) => a.createdAtUtc.localeCompare(b.createdAtUtc));
          this.sessions.set(evaluated);
          if (evaluated.length >= 2) {
            this.leftId.set(evaluated[0].id);
            this.rightId.set(evaluated[evaluated.length - 1].id);
            this.fetchResult(evaluated[0].id, "left");
            this.fetchResult(evaluated[evaluated.length - 1].id, "right");
          }
        },
        error: () => this.failed.set(true),
      });
  }

  setLeft(id: string): void {
    if (!id) return;
    const previousLeft = this.leftId();
    this.leftId.set(id);
    if (id === this.rightId()) {
      this.rightId.set(previousLeft);
      this.right.set(null);
      if (previousLeft) this.fetchResult(previousLeft, "right");
    }
    this.left.set(null);
    this.fetchResult(id, "left");
  }

  setRight(id: string): void {
    if (!id) return;
    const previousRight = this.rightId();
    this.rightId.set(id);
    if (id === this.leftId()) {
      this.leftId.set(previousRight);
      this.left.set(null);
      if (previousRight) this.fetchResult(previousRight, "left");
    }
    this.right.set(null);
    this.fetchResult(id, "right");
  }

  deltaFor(key: keyof InterviewScores): number {
    const later = this.right()?.scores[key];
    const earlier = this.left()?.scores[key];
    return typeof later === "number" && typeof earlier === "number"
      ? later - earlier
      : 0;
  }

  deltaText(key: keyof InterviewScores): string {
    const delta = this.deltaFor(key);
    return delta > 0 ? `+${delta}` : String(delta);
  }

  verdict(): string {
    const delta = this.overallDelta();
    return delta >= 5 ? "Improving" : delta <= -5 ? "Needs focus" : "Steady";
  }

  optionLabel(item: InterviewSession): string {
    const date = new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
    }).format(new Date(item.updatedAtUtc));
    return `${item.targetRole} · ${item.category} · ${date}`;
  }

  private fetchResult(id: string, side: "left" | "right"): void {
    this.api.results(id).subscribe({
      next: (result) =>
        side === "left" ? this.left.set(result) : this.right.set(result),
      error: () =>
        side === "left" ? this.left.set(null) : this.right.set(null),
    });
  }
}
