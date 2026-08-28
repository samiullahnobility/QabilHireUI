import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ApiActivityService } from "../services/api-activity.service";

@Component({
  standalone: true,
  selector: "app-api-loading-overlay",
  template: `@if (activity.active()) {
    <div class="api-overlay" role="status" aria-live="polite">
      <div class="loader-card">
        <span class="spinner" aria-hidden="true"></span
        ><strong>{{ activity.message() }}</strong
        ><small>Please keep this page open.</small>
      </div>
    </div>
  }`,
  styles: [
    `
      .api-overlay {
        position: fixed;
        z-index: 1000;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(248, 250, 252, 0.72);
        backdrop-filter: blur(4px);
      }
      .loader-card {
        display: flex;
        min-width: 280px;
        max-width: calc(100vw - 40px);
        flex-direction: column;
        align-items: center;
        padding: 32px 40px;
        border: 1px solid #dbe7e2;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
        text-align: center;
      }
      .spinner {
        width: 50px;
        height: 50px;
        margin-bottom: 18px;
        border: 4px solid #d8f5e9;
        border-top-color: #059669;
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
      }
      .loader-card strong {
        font-size: 16px;
      }
      .loader-card small {
        margin-top: 7px;
        color: #64748b;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiLoadingOverlayComponent {
  readonly activity = inject(ApiActivityService);
}
