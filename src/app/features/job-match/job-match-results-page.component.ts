import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { JobMatchApiService } from "./job-match-api.service";
import { JobMatch } from "./job-match.models";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  standalone: true,
  selector: "app-job-match-results-page",
  imports: [RouterLink, MatButtonModule],
  templateUrl: "./job-match-results-page.component.html",
  styleUrl: "./job-match.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobMatchResultsPageComponent {
  private readonly api = inject(JobMatchApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);
  readonly match = signal<JobMatch | null>(null);
  readonly loading = signal(true);
  constructor() {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.loading.set(false);
      return;
    }
    this.api.get(id).subscribe({
      next: (item) => {
        this.match.set(item);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notifications.error(error, "Unable to load this job match.");
      },
    });
  }
}
