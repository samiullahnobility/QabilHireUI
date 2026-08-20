import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-resume-loading-overlay',
  template: `<div class="loading-overlay" role="status" aria-live="polite"><div class="loader-card"><span class="spinner" aria-hidden="true"></span><strong>{{ message() }}</strong><small>Please keep this page open.</small></div></div>`,
  styles: [`.loading-overlay{position:fixed;z-index:30;inset:84px 0 0 252px;display:grid;place-items:center;background:rgba(248,250,252,.76);backdrop-filter:blur(4px)}.loader-card{display:flex;min-width:260px;flex-direction:column;align-items:center;padding:30px 38px;border:1px solid #dbe7e2;border-radius:18px;background:#fff;box-shadow:0 20px 50px rgba(15,23,42,.12)}.spinner{width:48px;height:48px;margin-bottom:18px;border:4px solid #d8f5e9;border-top-color:#059669;border-radius:50%;animation:spin .75s linear infinite}.loader-card strong{font-size:16px}.loader-card small{margin-top:7px;color:#64748b}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:900px){.loading-overlay{inset:72px 0 0}}`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeLoadingOverlayComponent {
  readonly message = input('Working on your resume...');
}
