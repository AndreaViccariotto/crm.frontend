import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../Modals/confirm-elimination-modals';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmElimination {
  constructor(private dialog: MatDialog) {}

  open(data: { title?: string; message?: string }) {
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-wrapper',
      backdropClass: 'dialog-backdrop',
      data
    }).afterClosed();
  }
}
