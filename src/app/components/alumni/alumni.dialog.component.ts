import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../base/base.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-alumni-dialog',
  templateUrl: './alumni.dialog.component.html',
  styleUrl: './alumni.dialog.component.scss',
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
export class AlumniDialogComponent extends BaseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AlumniDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    super();
    this.form = this.fb.group({
      userId: [data.userId || '1a84f8f8-8032-4da8-6f1d-08dd070decb1', Validators.required],
      alumniName: [data.alumniName, Validators.required ],
      dayOfBirth: [data.dayOfBirth, Validators.required],
      alumniGender: [data.alumniGender, Validators.required],
      alumniAddress: [data.alumniAddress, Validators.required],
      alumniEmail: [data.alumniEmail, Validators.required],
      alumniPhone: [data.alumniPhone, Validators.required],
      alumniMajor: [data.alumniMajor, Validators.required],
      alumniCourse: [data.alumniCourse, Validators.required],
      previousClass: [data.previousClass, Validators.required],
      graduationDay: [data.graduationDay, Validators.required],
      lecturerId: [data.lecturerId, Validators.required],
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }
    this.form.value.dayOfBirth = this.datePipe.transform(this.form.value.dayOfBirth, 'yyyy-MM-dd');
    this.form.value.graduationDay = this.datePipe.transform(this.form.value.graduationDay, 'yyyy-MM-dd');
    let body: { [key: string]: any } = {};
    Object.keys(this.form.value).forEach(key => body[key] = this.form.value[key]);

    if (this.data.id) {
      this.alumniService.update(body, this.data.id).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({error})
          alert(error?.error?.title || 'có lỗi xảy ra');
        }
      });
    } else {
      this.alumniService.add(body).pipe(
        finalize(() => {
          this.spinnerService.hideSpinner();
        })
      ).subscribe({
        next: (response: ApiResponse) => {
          this.dialogRef.close(true)
        },
        error: (error: ApiResponseError) => {
          console.log({error})
          alert(error?.error?.title || 'có lỗi xảy ra');
        }
      });
    }
  }
}

