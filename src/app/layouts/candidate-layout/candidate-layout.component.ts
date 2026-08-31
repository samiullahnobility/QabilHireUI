import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";

type NavItem = {
  label: string;
  link: string;
  requiresCompleteProfile?: boolean;
  requiredRoles?: string[];
  section?: string;
};

@Component({
  standalone: true,
  selector: "app-candidate-layout",
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatButtonModule],
  templateUrl: "./candidate-layout.component.html",
  styleUrl: "./candidate-layout.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly menuOpen = signal(false);
  readonly accountMenuOpen = signal(false);
  readonly user = this.auth.currentUser;
  readonly isCandidate = computed(() =>
    (this.user()?.roles ?? []).includes("Candidate"),
  );
  readonly isRecruiter = computed(() =>
    (this.user()?.roles ?? []).includes("Recruiter"),
  );
  readonly homeLink = computed(() => this.auth.homeUrl(this.user()));
  readonly profileComplete = computed(() => !!this.user()?.profileComplete);
  readonly roleLabel = computed(() =>
    this.user()?.roles?.length ? this.user()!.roles.join(", ") : "Candidate",
  );
  readonly profileLink = computed(() =>
    this.profileComplete() ? "/app/profile" : "/onboarding/profile",
  );
  readonly navItems: NavItem[] = [
    {
      label: "Dashboard",
      link: "/app/dashboard",
      requiresCompleteProfile: true,
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Resume Analysis",
      link: "/app/resume",
      requiresCompleteProfile: true,
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Job Match",
      link: "/app/job-match",
      requiresCompleteProfile: true,
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Job Search",
      link: "/app/jobs",
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "My Applications",
      link: "/app/applications",
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Saved Jobs",
      link: "/app/saved-jobs",
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Mock Interviews",
      link: "/app/interviews/setup",
      requiresCompleteProfile: true,
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Progress",
      link: "/app/progress",
      requiresCompleteProfile: true,
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Career Coach",
      link: "/app/career-coach",
      requiresCompleteProfile: true,
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
    {
      label: "Recruiter Dashboard",
      link: "/app/recruiter",
      requiredRoles: ["Recruiter"],
      section: "RECRUITER TOOLS",
    },
    {
      label: "Job Postings",
      link: "/app/recruiter/jobs",
      requiredRoles: ["Recruiter"],
      section: "RECRUITER TOOLS",
    },
    {
      label: "Applicants",
      link: "/app/recruiter/applicants",
      requiredRoles: ["Recruiter"],
      section: "RECRUITER TOOLS",
    },
    {
      label: "Application Pipeline",
      link: "/app/recruiter/pipeline",
      requiredRoles: ["Recruiter"],
      section: "RECRUITER TOOLS",
    },
    {
      label: "Interviews",
      link: "/app/recruiter/interviews",
      requiredRoles: ["Recruiter"],
      section: "RECRUITER TOOLS",
    },
    {
      label: "Recruiter Settings",
      link: "/app/recruiter/settings",
      requiredRoles: ["Recruiter"],
      section: "RECRUITER TOOLS",
    },
    {
      label: "Admin Dashboard",
      link: "/app/admin/dashboard",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "User Management",
      link: "/app/admin/users",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "Roles & Permissions",
      link: "/app/admin/roles",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "Job Management",
      link: "/app/admin/jobs",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "Platform Activity",
      link: "/app/admin/activity",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "AI & System Health",
      link: "/app/admin/health",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "Reports & Analytics",
      link: "/app/admin/reports",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "Admin Settings",
      link: "/app/admin/settings",
      requiredRoles: ["Admin"],
      section: "ADMINISTRATION",
    },
    {
      label: "Profile & Settings",
      link: "/app/profile",
      requiredRoles: ["Candidate"],
      section: "AI CAREER PREPARATION",
    },
  ];
  readonly visibleNavItems = computed(() => {
    const roles = this.user()?.roles ?? [];
    return this.navItems.filter(
      (item) =>
        !item.requiredRoles ||
        item.requiredRoles.some((role) => roles.includes(role)),
    );
  });
  readonly pageData = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let current = this.router.routerState.snapshot.root;
        while (current.firstChild) current = current.firstChild;
        return {
          title: current.data["title"] as string | undefined,
          subtitle: current.data["subtitle"] as string | undefined,
          hideSearch: current.data["hideSearch"] === true,
        };
      }),
    ),
    {
      initialValue: {
        title: undefined,
        subtitle: undefined,
        hideSearch: false,
      },
    },
  );

  onNavClick(event: MouseEvent, item: NavItem): void {
    if (item.requiresCompleteProfile && !this.profileComplete()) {
      event.preventDefault();
      event.stopPropagation();
      this.notifications.warning(
        "Please complete your profile first to access this section.",
      );
      void this.router.navigateByUrl("/onboarding/profile");
      this.closeMenu();
      return;
    }

    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
  closeMenu(): void {
    this.menuOpen.set(false);
  }
  toggleAccountMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.accountMenuOpen.update((open) => !open);
  }
  closeAccountMenu(): void {
    this.accountMenuOpen.set(false);
  }
  @HostListener("document:click")
  onDocumentClick(): void {
    this.closeAccountMenu();
  }
  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.closeAccountMenu();
  }
  logout(): void {
    this.closeAccountMenu();
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl("/auth/login"),
      error: () => void this.router.navigateByUrl("/auth/login"),
    });
  }
}
