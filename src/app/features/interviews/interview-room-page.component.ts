import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";
import { NotificationService } from "../../core/services/notification.service";
import { InterviewApiService } from "./interview-api.service";
import { ActiveInterviewQuestion } from "./interview.models";

@Component({
  standalone: true,
  selector: "app-interview-room-page",
  imports: [FormsModule, MatButtonModule],
  templateUrl: "./interview-room-page.component.html",
  styleUrl: "./interview-room.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewRoomPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(InterviewApiService);
  private readonly notifications = inject(NotificationService);
  private timerId = 0;
  private recordingTimeout = 0;
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private audioChunks: BlobPart[] = [];
  readonly id = this.route.snapshot.paramMap.get("id")!;
  readonly question = signal<ActiveInterviewQuestion | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly transcribing = signal(false);
  readonly preparing = signal(false);
  readonly online = signal(navigator.onLine);
  readonly recording = signal(false);
  readonly micBlocked = signal(false);
  readonly elapsed = signal(0);
  answer = "";
  private readonly onlineHandler = () => this.online.set(true);
  private readonly offlineHandler = () => this.online.set(false);
  constructor() {
    window.addEventListener("online", this.onlineHandler);
    window.addEventListener("offline", this.offlineHandler);
    this.load();
    this.timerId = window.setInterval(
      () => this.elapsed.update((v) => v + 1),
      1000,
    );
  }
  get timeLabel(): string {
    const remaining = Math.max(0, 15 * 60 - this.elapsed());
    return `${Math.floor(remaining / 60)
      .toString()
      .padStart(
        2,
        "0",
      )}:${(remaining % 60).toString().padStart(2, "0")} remaining`;
  }
  load(): void {
    this.api
      .activeQuestion(this.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (q) => {
          this.question.set(q);
          this.elapsed.set(
            Math.max(
              0,
              Math.floor(
                (Date.now() - new Date(q.startedAtUtc).getTime()) / 1000,
              ),
            ),
          );
        },
        error: (error) =>
          this.notifications.error(
            error,
            "Unable to load the active question.",
          ),
      });
  }
  async toggleRecording(): Promise<void> {
    if (this.recording()) {
      this.stopAndTranscribe();
      return;
    }
    try {
      this.micBlocked.set(false);
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.recorder = new MediaRecorder(this.stream, {
        mimeType: "audio/webm",
      });
      this.recorder.ondataavailable = (event) => {
        if (event.data.size) this.audioChunks.push(event.data);
      };
      this.recorder.start(1000);
      this.recording.set(true);
      this.recordingTimeout = window.setTimeout(
        () => this.stopAndTranscribe(),
        290000,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        this.micBlocked.set(true);
        return;
      }
      this.notifications.error(
        null,
        "Microphone is unavailable. Use the text answer instead.",
      );
    }
  }
  retryMicrophone(): void {
    this.micBlocked.set(false);
    void this.toggleRecording();
  }
  useTextAnswer(): void {
    this.micBlocked.set(false);
  }
  private stopAndTranscribe(): void {
    const q = this.question();
    if (!q || !this.recorder || this.recorder.state === "inactive") return;
    clearTimeout(this.recordingTimeout);
    this.recording.set(false);
    this.transcribing.set(true);
    this.recorder.onstop = () => {
      this.stream?.getTracks().forEach((t) => t.stop());
      const audio = new Blob(this.audioChunks, { type: "audio/webm" });
      this.api
        .transcribe(this.id, q.questionId, audio)
        .pipe(finalize(() => this.transcribing.set(false)))
        .subscribe({
          next: (result) => {
            this.answer = result.transcript;
            this.audioChunks = [];
          },
          error: (error) => {
            this.audioChunks = [];
            this.notifications.error(
              error,
              "Unable to transcribe this recording. Record again or use text mode.",
            );
          },
        });
    };
    this.recorder.stop();
  }
  submit(): void {
    const q = this.question();
    if (
      !q ||
      !this.answer.trim() ||
      this.submitting() ||
      this.transcribing() ||
      this.recording() ||
      !this.online()
    )
      return;
    this.submitting.set(true);
    const source =
      q.responseMode === "Voice" &&
      !this.route.snapshot.queryParamMap.has("textFallback")
        ? "Voice"
        : "Text";
    this.api
      .submitAnswer(this.id, q.questionId, this.answer.trim(), source)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (result) => {
          this.answer = "";
          if (result.isCompleted) {
            void this.router.navigate(["/app/interviews", this.id, "complete"]);
            return;
          }
          this.preparing.set(true);
          setTimeout(() => {
            this.question.set(result.nextQuestion);
            this.preparing.set(false);
          }, 800);
        },
        error: (error) =>
          this.notifications.error(error, "Unable to save this answer."),
      });
  }
  repeat(): void {
    const text = this.question()?.question;
    if (text && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.timerId);
    clearTimeout(this.recordingTimeout);
    window.removeEventListener("online", this.onlineHandler);
    window.removeEventListener("offline", this.offlineHandler);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.audioChunks = [];
  }
}
