import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  success(message: string): void {
    this.toastr.success(message, 'Success');
  }

  warning(message: string): void {
    this.toastr.warning(message, 'Notice');
  }

  error(error: unknown, fallback = 'Something went wrong. Please try again.'): void {
    if (!(error instanceof HttpErrorResponse)) {
      this.toastr.error(fallback, 'Error');
      return;
    }

    const validationErrors = error.error?.errors as Record<string, string[]> | undefined;
    const message = validationErrors
      ? Object.values(validationErrors).flat().join(' ')
      : error.error?.message ?? fallback;
    this.toastr.error(message, 'Error');
  }
}
