import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

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
  private readonly router = inject(Router);
  readonly menuOpen = signal(false);
  readonly user = this.auth.currentUser;
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

  toggleMenu(): void { this.menuOpen.update(open => !open); }
  closeMenu(): void { this.menuOpen.set(false); }
  logout(): void {
    this.auth.logout().subscribe({ next: () => void this.router.navigateByUrl('/auth/login') });
  }
}
