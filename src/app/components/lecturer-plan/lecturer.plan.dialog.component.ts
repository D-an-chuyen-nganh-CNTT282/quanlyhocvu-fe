import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../base/base.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-lecturer-plan-dialog',
  templateUrl: './lecturer.plan.dialog.component.html',
  styleUrl: './lecturer.plan.dialog.component.scss',
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
    MatDatepickerModule
  ],
  providers: [ DatePipe, {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
})
export class LecturerPlanDialogComponent extends BaseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<LecturerPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    super();
    this.form = this.fb.group({
      lecturerId: [data.lecturerId || ''],
      planContent: [data.planContent, Validators.required ],
      startDate: [data.startDate, Validators.required],
      endDate: [data.endDate, Validators.required],
      note: [data.note, Validators.required],
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }
    this.form.value.startDate = this.datePipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
    this.form.value.endDate = this.datePipe.transform(this.form.value.endDate, 'yyyy-MM-dd');

    let body: { [key: string]: any } = {};
    Object.keys(this.form.value).forEach(key => body[key] = this.form.value[key]);

    if (this.data.id) {
      this.lecturerPlanService.update(body, this.data.id).pipe(
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
      this.lecturerPlanService.add(body).pipe(
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


