import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
    private spinnerDialogRef: MatDialogRef<SpinnerComponent> | null = null;

  private spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerState$ = this.spinnerSubject.asObservable();

  constructor(private dialog: MatDialog) {}

  showSpinner() {
    this.spinnerDialogRef = this.dialog.open(SpinnerComponent, {
        width: '100%',
        height: '100%',
        panelClass: 'fullscreen-dialog',
        disableClose: true,
      });
  }

  hideSpinner() {
    if (this.spinnerDialogRef) {
        this.spinnerDialogRef.close(); // Close only the spinner dialog
        this.spinnerDialogRef = null; // Reset the reference
      }
  }
}
