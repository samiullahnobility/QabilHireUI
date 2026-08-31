import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { CareerCoachApiService } from "./career-coach-api.service";
import { CoachTurn } from "./career-coach.models";

@Component({
  standalone: true,
  selector: "app-career-coach-page",
  imports: [FormsModule, MatButtonModule],
  templateUrl: "./career-coach-page.component.html",
  styleUrl: "./career-coach-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerCoachPageComponent {
  private readonly api = inject(CareerCoachApiService);
  private readonly notifications = inject(NotificationService);
  readonly messages = signal<CoachTurn[]>([]);
  readonly busy = signal(false);
  readonly quickPrompts = [
    "Which roles suit me?",
    "What should I learn?",
    "Improve my resume",
    "Create a 7-day plan",
  ];
  draft = "";

  send(text?: string): void {
    if (this.busy()) return;
    const content = (text ?? this.draft).trim();
    if (!content) return;
    const history = this.messages().slice(-8);
    this.messages.update((items) => [...items, { role: "user", content }]);
    this.draft = "";
    this.busy.set(true);
    this.api
      .ask(content, history)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (result) =>
          this.messages.update((items) => [
            ...items,
            { role: "assistant", content: result.reply },
          ]),
        error: (error) => {
          this.messages.update((items) => items.slice(0, -1));
          this.notifications.error(
            error,
            "The career coach is unavailable right now. Please try again.",
          );
        },
      });
  }
}
