import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-notification-dialog',
  imports: [],
  templateUrl: './notification-dialog.html',
  styleUrl: './notification-dialog.scss'
})
export class NotificationDialog {
constructor(
    @Inject(MAT_DIALOG_DATA) public data: {title?: string; message: string },
    private dialogRef: MatDialogRef<NotificationDialog>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
