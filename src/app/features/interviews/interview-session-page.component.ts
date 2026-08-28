import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { InterviewApiService } from "./interview-api.service";
import { InterviewSession } from "./interview.models";

@Component({
  standalone: true,
  selector: "app-interview-session-page",
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./interview-session-page.component.html",
  styleUrl: "./interview.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewSessionPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(InterviewApiService);
  private readonly notifications = inject(NotificationService);
  readonly session = signal<InterviewSession | null>(null);
  readonly loading = signal(true);
  readonly starting = signal(false);
  constructor() {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.loading.set(false);
      return;
    }
    this.api
      .get(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (session) => this.session.set(session),
        error: (error) =>
          this.notifications.error(error, "Unable to load this interview."),
      });
  }
  continue(): void {
    const session = this.session();
    if (!session || this.starting()) return;
    if (session.responseMode === "Voice") {
      void this.router.navigate([
        "/app/interviews",
        session.id,
        "microphone-test",
      ]);
      return;
    }
    this.starting.set(true);
    this.api
      .start(session.id)
      .pipe(finalize(() => this.starting.set(false)))
      .subscribe({
        next: () =>
          void this.router.navigate(["/app/interviews", session.id, "room"]),
        error: (error) =>
          this.notifications.error(error, "Unable to start this interview."),
      });
  }
}
