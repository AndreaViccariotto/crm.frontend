import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Conferma' }}</h2>

    <mat-dialog-content>
      {{ data.message || 'Sei sicuro?' }}
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">Annulla</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        Conferma
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}