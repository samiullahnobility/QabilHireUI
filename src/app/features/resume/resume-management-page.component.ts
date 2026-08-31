import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { ResumeApiService } from "./resume-api.service";
import { ResumeResponse } from "./resume-api.models";

@Component({
  standalone: true,
  selector: "app-resume-management-page",
  imports: [RouterLink],
  templateUrl: "./resume-management-page.component.html",
  styleUrl: "./resume-management-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeManagementPageComponent {
  private readonly api = inject(ResumeApiService);
  private readonly notifications = inject(NotificationService);
  readonly loading = signal(true);
  readonly resumes = signal<ResumeResponse[]>([]);
  readonly working = signal<string | null>(null);
  readonly confirmingDelete = signal<string | null>(null);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => this.resumes.set(items),
        error: (error) =>
          this.notifications.error(error, "Unable to load your resume."),
      });
  }

  requestDelete(id: string): void {
    this.confirmingDelete.set(id);
  }

  cancelDelete(): void {
    this.confirmingDelete.set(null);
  }

  delete(id: string): void {
    this.confirmingDelete.set(null);
    this.working.set("Deleting resume...");
    this.api
      .delete(id)
      .pipe(finalize(() => this.working.set(null)))
      .subscribe({
        next: () =>
          this.resumes.update((items) =>
            items.filter((item) => item.id !== id),
          ),
        error: (error) =>
          this.notifications.error(error, "Unable to delete your resume."),
      });
  }

  setActive(id: string): void {
    this.working.set("Setting active resume...");
    this.api
      .setActive(id)
      .pipe(finalize(() => this.working.set(null)))
      .subscribe({
        next: () => this.refresh(),
        error: (error) =>
          this.notifications.error(error, "Unable to set the active resume."),
      });
  }

  toggleArchive(id: string): void {
    this.working.set("Updating resume...");
    this.api
      .toggleArchive(id)
      .pipe(finalize(() => this.working.set(null)))
      .subscribe({
        next: () => this.refresh(),
        error: (error) =>
          this.notifications.error(
            error,
            "Unable to update the resume archive.",
          ),
      });
  }
}
