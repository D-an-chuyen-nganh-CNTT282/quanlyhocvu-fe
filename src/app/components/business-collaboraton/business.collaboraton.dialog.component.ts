import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../base/base.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-business-collaboraton-dialog',
  templateUrl: './business.collaboraton.dialog.component.html',
  styleUrl: './business.collaboraton.dialog.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class BusinessCollaboratonDialogComponent extends BaseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BusinessCollaboratonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.form = this.fb.group({
      businessId: [data.businessId, Validators.required],
      projectName: [data.projectName, Validators.required],
      projectStatuss: [data.projectStatuss, Validators.required],
      result: [data.result || null],
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }

    let body: { [key: string]: any } = {};
    Object.keys(this.form.value).forEach(key => body[key] = this.form.value[key]);

    if (this.data.id) {
      this.businessCollaborationService.update(body, this.data.id).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({error})
          alert(error?.error?.title || 'co loi xay ra');
        }
      });
    } else {
      this.businessCollaborationService.add(body).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({error})
          alert(error?.error?.title || 'co loi xay ra');
        }
      });
    }
  }
}



