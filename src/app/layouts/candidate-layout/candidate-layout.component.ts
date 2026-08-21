import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

type NavItem = {
  label: string;
  link: string;
  requiresCompleteProfile?: boolean;
};

@Component({
  standalone: true,
  selector: 'app-candidate-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatButtonModule],
  templateUrl: './candidate-layout.component.html',
  styleUrl: './candidate-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly menuOpen = signal(false);
  readonly accountMenuOpen = signal(false);
  readonly user = this.auth.currentUser;
  readonly profileComplete = computed(() => !!this.user()?.profileComplete);
  readonly roleLabel = computed(() => this.user()?.roles?.length ? this.user()!.roles.join(', ') : 'Candidate');
  readonly profileLink = computed(() => this.profileComplete() ? '/app/profile' : '/onboarding/profile');
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', link: '/app/dashboard', requiresCompleteProfile: true },
    { label: 'Resume Analysis', link: '/app/resume', requiresCompleteProfile: true },
    { label: 'Job Match', link: '/app/job-match', requiresCompleteProfile: true },
    { label: 'Mock Interviews', link: '/app/interviews/setup', requiresCompleteProfile: true },
    { label: 'Progress', link: '/app/progress', requiresCompleteProfile: true },
    { label: 'Career Coach', link: '/app/career-coach', requiresCompleteProfile: true },
    { label: 'Profile & Settings', link: '/app/profile' }
  ];
  readonly pageData = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let current = this.router.routerState.snapshot.root;
      while (current.firstChild) current = current.firstChild;
      return {
        title: current.data['title'] as string | undefined,
        subtitle: current.data['subtitle'] as string | undefined,
        hideSearch: current.data['hideSearch'] === true
      };
    })
  ), { initialValue: { title: undefined, subtitle: undefined, hideSearch: false } });

  onNavClick(event: MouseEvent, item: NavItem): void {
    if (item.requiresCompleteProfile && !this.profileComplete()) {
      event.preventDefault();
      event.stopPropagation();
      this.notifications.warning('Please complete your profile first to access this section.');
      void this.router.navigateByUrl('/onboarding/profile');
      this.closeMenu();
      return;
    }

    this.closeMenu();
  }

  toggleMenu(): void { this.menuOpen.update(open => !open); }
  closeMenu(): void { this.menuOpen.set(false); }
  toggleAccountMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.accountMenuOpen.update(open => !open);
  }
  closeAccountMenu(): void { this.accountMenuOpen.set(false); }
  @HostListener('document:click')
  onDocumentClick(): void { this.closeAccountMenu(); }
  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeAccountMenu(); }
  logout(): void {
    this.closeAccountMenu();
    this.auth.logout().subscribe({ next: () => void this.router.navigateByUrl('/auth/login') });
  }
}
