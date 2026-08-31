import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export function withRoles(...roles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();
    const allowed = (user?.roles ?? []).some((role) => roles.includes(role));
    if (allowed) return true;
    return router.parseUrl(auth.homeUrl(user));
  };
}
