import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { StudentDialogComponent } from '../student/student.dialog.component';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-extracurricular.activities.dialog',
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
  templateUrl: './extracurricular.activities.dialog.component.html',
  styleUrl: './extracurricular.activities.dialog.component.scss'
})
export class ExtracurricularActivitiesDialogComponent extends BaseComponent {
  form: FormGroup;
  studentId: string;
  activityId: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExtracurricularActivitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    super();
    this.form = this.fb.group({
      studentId: [data.studentId, Validators.required],
      activitiesId: [data.activitiesId, Validators.required ],
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }
    // const formattedSendDate = this.datePipe.transform(this.form.value.sendDate, 'yyyy-MM-dd');
    // const formattedDueDate = this.datePipe.transform(this.form.value.dueDate, 'yyyy-MM-dd');
    let body: { [key: string]: any } = {};
    Object.keys(this.form.value).forEach(key => body[key] = this.form.value[key]);
    console.log({body});

    

    if (this.data.id) {
      const params = new HttpParams()
    .set('id', this.data.id)
    .set('studentId', this.data.studentId)
    .set('activitiesId', this.data.activitiesId)
      this.extracurricularActivitiesService.update(body, params).pipe(
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
      this.extracurricularActivitiesService.add(body).pipe(
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
