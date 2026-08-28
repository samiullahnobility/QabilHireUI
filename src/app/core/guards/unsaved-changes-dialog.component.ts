import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Leave this page?</h2>
    <mat-dialog-content
      >You have unsaved changes. If you leave now, your changes will be
      lost.</mat-dialog-content
    >
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close(false)">Stay</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        (click)="close(true)"
      >
        Leave
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesDialogComponent {
  private readonly ref = inject(MatDialogRef<UnsavedChangesDialogComponent>);
  close(leave: boolean): void {
    this.ref.close(leave);
  }
}
