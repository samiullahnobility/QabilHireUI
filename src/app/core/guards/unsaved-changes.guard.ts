import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { UnsavedChangesDialogComponent } from './unsaved-changes-dialog.component';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = component => {
  if (!component.hasUnsavedChanges()) return true;
  return inject(MatDialog)
    .open(UnsavedChangesDialogComponent, { width: 'min(440px, calc(100vw - 32px))', autoFocus: 'dialog' })
    .afterClosed()
    .pipe(map(leave => leave === true));
};
