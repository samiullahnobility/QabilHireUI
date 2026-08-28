import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const isSessionEndpoint =
    request.url.endsWith("/auth/refresh") ||
    request.url.endsWith("/auth/logout");
  const isCredentialEndpoint =
    request.url.endsWith("/auth/login") ||
    request.url.endsWith("/auth/register") ||
    request.url.endsWith("/auth/forgot-password") ||
    request.url.endsWith("/auth/reset-password");

  const authenticatedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isSessionEndpoint ||
        isCredentialEndpoint
      ) {
        return throwError(() => error);
      }

      return auth.refresh().pipe(
        switchMap(() => {
          const refreshedToken = auth.getAccessToken();
          return next(
            refreshedToken
              ? request.clone({
                  setHeaders: { Authorization: `Bearer ${refreshedToken}` },
                })
              : request,
          );
        }),
        catchError((refreshError) => {
          auth.clearLocalSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
