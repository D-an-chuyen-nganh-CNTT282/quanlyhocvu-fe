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
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-business-activities-dialog',
  templateUrl: './business.activities.dialog.component.html',
  styleUrl: './business.activities.dialog.component.scss',
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
export class BusinessActivitiesDialogComponent extends BaseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BusinessActivitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.form = this.fb.group({
      businessId: [data.businessId, Validators.required],
      activitiesId: [data.activitiesId, Validators.required]
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
      const params = new HttpParams()
        .set('id', this.data.id)
        .set('businessId', this.data.businessId)
        .set('activitiesId', this.data.activitiesId)
      this.businessActivitiesService.update(body, params).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({ error })
          alert(error?.error?.title || 'có lỗi xảy ra');
        }
      });
    } else {
      this.businessActivitiesService.add(body).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({ error })
          alert(error?.error?.title || 'có lỗi xảy ra');
        }
      });
    }
  }
}



