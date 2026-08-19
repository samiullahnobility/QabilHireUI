import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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

  toggleMenu(): void { this.menuOpen.update(open => !open); }
  closeMenu(): void { this.menuOpen.set(false); }
  logout(): void {
    this.auth.logout().subscribe({ next: () => void this.router.navigateByUrl('/auth/login') });
  }
}
