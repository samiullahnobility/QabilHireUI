import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { ResumeApiService } from "./resume-api.service";
import { ResumeResponse } from "./resume-api.models";

@Component({
  standalone: true,
  selector: "app-resume-upload-page",
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./resume-upload-page.component.html",
  styleUrl: "./resume-upload-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeUploadPageComponent {
  private static readonly AllowedExtensions = [".pdf", ".docx"];
  private static readonly MaxFileSizeBytes = 10 * 1024 * 1024;
  private readonly api = inject(ResumeApiService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly selectedFile = signal<File | null>(null);
  readonly uploaded = signal<ResumeResponse | null>(null);
  readonly uploading = signal(false);
  readonly extracting = signal(false);
  readonly resumes = signal<ResumeResponse[]>([]);
  readonly uploadMessage = signal<string | null>(null);
  readonly uploadError = signal<string | null>(null);
  readonly progress = signal(0);
  readonly dragActive = signal(false);
  readonly confirmingRemove = signal<string | null>(null);
  readonly sizeOverrides = signal<Record<string, number>>({});

  constructor() {
    this.loadResumes();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(true);
  }

  onDragLeave(): void {
    this.dragActive.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
    this.setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  choose(event: Event): void {
    this.setFile((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  private setFile(file: File | null): void {
    this.uploadError.set(null);
    this.uploadMessage.set(null);
    this.progress.set(0);
    if (!file) {
      this.selectedFile.set(null);
      return;
    }
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ResumeUploadPageComponent.AllowedExtensions.includes(extension)) {
      this.selectedFile.set(null);
      this.uploadError.set("Only PDF and DOCX files are allowed.");
      return;
    }
    if (file.size > ResumeUploadPageComponent.MaxFileSizeBytes) {
      this.selectedFile.set(null);
      this.uploadError.set("Resume must be 10 MB or smaller.");
      return;
    }
    this.selectedFile.set(file);
  }

  fileSize(bytes: number): string {
    if (!bytes) return "Size unavailable";
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  displayedSize(resume: ResumeResponse): string {
    return this.fileSize(
      resume.sizeBytes || this.sizeOverrides()[resume.id] || 0,
    );
  }

  resumeDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  private loadResumes(): void {
    this.api.list().subscribe({
      next: (resumes) => this.resumes.set(resumes),
      error: (error) =>
        this.notifications.error(error, "Unable to load your resumes."),
    });
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.uploading.set(true);
    this.uploadError.set(null);
    this.uploadMessage.set(null);
    this.progress.set(0);
    this.api.uploadWithProgress(file).subscribe({
      next: (update) => {
        if (update.kind === "progress") {
          this.progress.set(update.percent);
          return;
        }
        const resume = update.resume;
        if (!resume?.id) {
          this.uploading.set(false);
          this.uploadError.set(
            "The server returned an empty response. Please try again.",
          );
          return;
        }
        this.uploaded.set(resume);
        this.sizeOverrides.update((items) => ({
          ...items,
          [resume.id]: file.size,
        }));
        this.startExtraction(resume.id);
      },
      error: (error) => {
        this.uploading.set(false);
        this.progress.set(0);
        this.uploadError.set(
          "Unable to upload your resume. Check your connection and try again.",
        );
        this.notifications.error(error, "Unable to upload your resume.");
      },
    });
  }

  private startExtraction(id: string): void {
    this.extracting.set(true);
    this.api
      .extract(id)
      .pipe(
        finalize(() => {
          this.uploading.set(false);
          this.extracting.set(false);
        }),
      )
      .subscribe({
        next: (resume) => {
          this.uploaded.set(resume);
          this.uploadMessage.set(
            "Resume uploaded successfully. Your resume is ready to review.",
          );
          this.notifications.success("Resume uploaded successfully.");
          window.setTimeout(
            () => void this.router.navigate(["/app/resume", resume.id, "edit"]),
            900,
          );
        },
        error: (error) => {
          this.uploadError.set(
            "The resume was uploaded, but AI extraction failed. Retry extraction from your resume library.",
          );
          this.notifications.error(
            error,
            "Resume uploaded, but extraction failed.",
          );
          this.loadResumes();
        },
      });
  }

  retryExtraction(id: string): void {
    this.extracting.set(true);
    this.uploadError.set(null);
    this.api
      .extract(id)
      .pipe(finalize(() => this.extracting.set(false)))
      .subscribe({
        next: () => {
          this.notifications.success("Resume extracted successfully.");
          this.loadResumes();
        },
        error: (error) =>
          this.notifications.error(error, "Unable to retry extraction."),
      });
  }

  requestRemove(id: string): void {
    this.confirmingRemove.set(id);
  }

  cancelRemove(): void {
    this.confirmingRemove.set(null);
  }

  deleteResume(id: string): void {
    this.confirmingRemove.set(null);
    this.api.delete(id).subscribe({
      next: () => {
        this.resumes.update((items) => items.filter((item) => item.id !== id));
        if (this.uploaded()?.id === id) this.uploaded.set(null);
        this.notifications.success("Resume removed successfully.");
      },
      error: (error) =>
        this.notifications.error(error, "Unable to remove your resume."),
    });
  }
}
