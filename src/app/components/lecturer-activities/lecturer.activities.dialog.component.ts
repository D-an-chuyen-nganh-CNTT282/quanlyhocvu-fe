import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { BaseComponent } from '../base/base.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-lecturer.activities-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  templateUrl: './lecturer.activities.dialog.component.html',
  styleUrl: './lecturer.activities.dialog.component.scss'
})
export class LecturerActivitiesDialogComponent extends BaseComponent {
  form: FormGroup;
  studentId: string;
  activityId: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LecturerActivitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    super();
    this.form = this.fb.group({
      lecturerId: [data.lecturerId, Validators.required],
      activitiesId: [data.activitiesId, Validators.required ],
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
      .set('lecturerId', this.data.lecturerId)
      .set('activitiesId', this.data.activitiesId)
      console.log({params})
      this.lecturerActivitiesService.update(body, params).pipe(
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
      this.lecturerActivitiesService.add(body).pipe(
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

