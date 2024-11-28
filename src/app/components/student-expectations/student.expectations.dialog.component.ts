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
  selector: 'app-student.expectations.dialog',
   templateUrl: './student.expectations.dialog.component.html',
  styleUrl: './student.expectations.dialog.component.scss',
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
  providers: [ DatePipe, {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
})
export class StudentExpectationsDialogComponent extends BaseComponent {
  form: FormGroup;
  departmentId: string;
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private dialogRef: MatDialogRef<StudentExpectationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    super();
    this.form = this.fb.group({
      requestCategory: [data.requestCategory, Validators.required],
      studentId: [data.studentId, Validators.required ],
      userId: [data.userId || null],
      processingStatus: [data.processingStatus],
      requestDate: [data.requestDate],
      completionDate: [data.completionDate],
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }
    const formattedRequestDate = this.datePipe.transform(this.form.value.requestDate, 'yyyy-MM-dd');
    const formattedCompletionDate = this.datePipe.transform(this.form.value.completionDate, 'yyyy-MM-dd');
    let params = new HttpParams()
    .set('StudentId', this.form.value.studentId)
    .set('RequestCategory', this.form.value.requestCategory)
    // .set('UserId', this.form.value.userId || null)
    .set('Status', this.form.value.processingStatus)
    .set('RequestDate', formattedRequestDate || '')
    .set('CompletionDate', formattedCompletionDate || '');
    let formData = new FormData();
    if (this.selectedFile) {
      formData.append('FileScanUrl', this.selectedFile, this.selectedFile.name);
    } else if (this.data.fileScanUrl) {
      await this.downloadFileAndAppend(this.data.fileScanUrl, formData);
    }

    if (this.data.id) {
      params = params.set('id', this.data.id);
      this.studentExpectationsService.update(formData, params).pipe(
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
      this.studentExpectationsService.add(formData, params).pipe(
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file); 
    }
  }

  async downloadFileAndAppend(fileUrl: string, formData: FormData): Promise<void> {
    const fileBlob = await this.http.get(fileUrl, { responseType: 'blob' }).toPromise() as Blob;      
    const fileName = fileUrl.split('/').pop();
    formData.append('FileScanUrl', fileBlob, fileName);
  }
}

