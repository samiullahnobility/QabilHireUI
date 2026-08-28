import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { ProfileDraftService } from "./profile-draft.service";
import { NotificationService } from "../../core/services/notification.service";
import { finalize } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  selector: "app-profile-review-page",
  imports: [MatButtonModule],
  templateUrl: "./profile-review-page.component.html",
  styleUrl: "./profile-setup.shared.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileReviewPageComponent {
  private readonly router = inject(Router);
  private readonly draft = inject(ProfileDraftService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);
  readonly profile = this.draft.value;
  readonly saving = signal(false);
  back(): void {
    void this.router.navigateByUrl("/onboarding/profile/career-goals");
  }
  complete(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.draft
      .save()
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.auth.markProfileComplete();
          this.notifications.success("Your profile setup is complete.");
          void this.router.navigateByUrl("/app/dashboard");
        },
        error: (error) =>
          this.notifications.error(error, "Unable to save your profile."),
      });
  }
}
