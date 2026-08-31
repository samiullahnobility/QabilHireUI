import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.getAccessToken()
    ? true
    : router.createUrlTree(["/auth/login"], {
        queryParams: { returnUrl: state.url },
      });
};

export const profileCompleteGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser();

  if (!user) {
    return router.createUrlTree(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
  }

  // Recruiter and Admin accounts never complete candidate onboarding.
  if (!user.roles.includes("Candidate")) {
    return true;
  }

  return user.profileComplete
    ? true
    : router.createUrlTree(["/onboarding/profile"]);
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.getAccessToken()
    ? inject(Router).parseUrl(auth.homeUrl())
    : true;
};
