import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { JobMatchApiService } from "./job-match-api.service";
import { JobMatch } from "./job-match.models";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  standalone: true,
  selector: "app-job-match-history-page",
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: "./job-match-history-page.component.html",
  styleUrl: "./job-match-history-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobMatchHistoryPageComponent {
  private readonly api = inject(JobMatchApiService);
  private readonly notifications = inject(NotificationService);
  readonly matches = signal<JobMatch[]>([]);
  readonly loading = signal(true);
  readonly search = signal("");
  readonly level = signal("all");
  readonly minimumScore = signal("all");
  readonly filteredMatches = computed(() => {
    const query = this.search().trim().toLowerCase();
    const selectedLevel = this.level();
    const minimum =
      this.minimumScore() === "all" ? 0 : Number(this.minimumScore());
    return this.matches().filter(
      (item) =>
        (!query ||
          `${item.targetJobTitle} ${item.company ?? ""}`
            .toLowerCase()
            .includes(query)) &&
        (selectedLevel === "all" || item.matchLevel === selectedLevel) &&
        item.overallScore >= minimum,
    );
  });
  constructor() {
    this.api.list().subscribe({
      next: (items) => {
        this.matches.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notifications.error(error, "Unable to load your job matches.");
      },
    });
  }
  clearFilters(): void {
    this.search.set("");
    this.level.set("all");
    this.minimumScore.set("all");
  }
  formatDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }
}
