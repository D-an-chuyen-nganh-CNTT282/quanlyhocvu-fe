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
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-internship-dialog',
  templateUrl: './internship.dialog.component.html',
  styleUrl: './internship.dialog.component.scss',
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
    MatDatepickerToggle,
  ],
  providers: [ DatePipe, {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
})
export class InternshipDialogComponent extends BaseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<InternshipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.form = this.fb.group({
      businessId: [data.businessId, Validators.required],
      studentId: [data.studentId, Validators.required],
      startDate: [data.startDate, Validators.required],
      endDate: [data.endDate, Validators.required],
      remark: [data.remark || null],
      rating: [data.rating || null],
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
    this.form.value.rating = this.form.value.rating !== null ? Number(this.form.value.rating) : null;

    let body: { [key: string]: any } = {};
    Object.keys(this.form.value).forEach(key => body[key] = this.form.value[key]);

    if (this.data.id) {
      const params = new HttpParams()
        .set('id', this.data.id)
        .set('businessId', this.data.businessId)
        .set('studentId', this.data.studentId)
      this.internshipService.update(body, params).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({ error })
          alert(error?.error?.title || 'co loi xay ra');
        }
      });
    } else {
      this.internshipService.add(body).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({ error })
          alert(error?.error?.title || 'co loi xay ra');
        }
      });
    }
  }
}




