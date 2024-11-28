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
  selector: 'app-alumni-activities-dialog',
  templateUrl: './alumni.activities.dialog.component.html',
  styleUrl: './alumni.activities.dialog.component.scss',
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
export class AlumniActivitiesDialogComponent extends BaseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AlumniActivitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.form = this.fb.group({
      alumniId: [data.alumniId, Validators.required],
      activitiesId: [data.activitiesId, Validators.required]
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    console.log({'this.form': this.form})
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }

    let body: { [key: string]: any } = {};
    Object.keys(this.form.value).forEach(key => body[key] = this.form.value[key]);

    if (this.data.id) {
      const params = new HttpParams()
        .set('id', this.data.id)
        .set('alumniId', this.data.alumniId)
        .set('activitiId', this.data.activitiesId)
      this.alumniActivitiesService.update(body, params).pipe(
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
      this.alumniActivitiesService.add(body).pipe(
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




