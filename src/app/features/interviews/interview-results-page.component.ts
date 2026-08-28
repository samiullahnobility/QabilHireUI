import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { InterviewApiService } from "./interview-api.service";
import { InterviewResult } from "./interview.models";
@Component({
  standalone: true,
  selector: "app-interview-results-page",
  imports: [DatePipe, MatButtonModule, RouterLink],
  templateUrl: "./interview-results-page.component.html",
  styleUrl: "./interview-results.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewResultsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(InterviewApiService);
  readonly id = this.route.snapshot.paramMap.get("id")!;
  readonly result = signal<InterviewResult | null>(null);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly metrics: [keyof InterviewResult["scores"], string][] = [
    ["technical", "Technical"],
    ["communication", "Communication"],
    ["confidence", "Confidence"],
    ["relevance", "Relevance"],
    ["problemSolving", "Problem solving"],
    ["professionalism", "Professionalism"],
  ];
  constructor() {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.api
      .results(this.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (r) => this.result.set(r),
        error: () => this.failed.set(true),
      });
  }
}
