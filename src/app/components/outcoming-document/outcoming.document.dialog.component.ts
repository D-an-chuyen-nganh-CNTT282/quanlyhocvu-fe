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
  selector: 'app-incoming-document-dialog',
  templateUrl: './outcoming.document.dialog.component.html',
  styleUrls: ['./outcoming.document.dialog.component.scss'],
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
export class OutcomingDocumentDialogComponent extends BaseComponent {
  form: FormGroup;
  departmentId: string;
  userId: string;
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private http: HttpClient,
    private dialogRef: MatDialogRef<OutcomingDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    super();
    console.log({data})
    this.form = this.fb.group({
      outgoingDocumentTitle: [data.outgoingDocumentTitle || '', Validators.required],
      outgoingDocumentContent: [data.outgoingDocumentContent || '', Validators.required ],
      sendDate: [data.sendDate],
      dueDate: [data.dueDate],
      departmentId: [data.departmentId || '', Validators.required],
      outgoingDocumentProcessingStatuss: [data.outgoingDocumentProcessingStatuss],
      recipientEmail: [data.recipientEmail || '', Validators.required],
      userId: [data.userId],
    });
  }

  async save(): Promise<void> {
    this.spinnerService.showSpinner();
    if (this.form.invalid) {
      this.spinnerService.hideSpinner();
      return;
    }
    // const selectedDepartmentId = this.form.get('DepartmentId')?.value;
    // console.log('Selected Department ID:', selectedDepartmentId);
    const formattedSendDate = this.datePipe.transform(this.form.value.sendDate, 'yyyy-MM-dd');
    const formattedDueDate = this.datePipe.transform(this.form.value.dueDate, 'yyyy-MM-dd');
    let params = new HttpParams()
    .set('OutgoingDocumentTitle', this.form.value.outgoingDocumentTitle)
    .set('OutgoingDocumentContent', this.form.value.outgoingDocumentContent)
    .set('SendDate', formattedSendDate || '')
    .set('DepartmentId', this.form.value.departmentId)
    .set('OutgoingDocumentProcessingStatuss', this.form.value.outgoingDocumentProcessingStatuss)
    .set('DueDate', formattedDueDate || '')
    .set('RecipientEmail', this.form.value.recipientEmail)
    .set('UserId', this.form.value.userId);
    let formData = new FormData();
    if (this.selectedFile) {
      formData.append('FileScanUrl', this.selectedFile, this.selectedFile.name);
    } else if (this.data.fileScanUrl) {
      await this.downloadFileAndAppend(this.data.fileScanUrl, formData);
    }

    if (this.data.id) {
      params = params.set('id', this.data.id);
      this.OutcomingDocumentService.updateDocument(formData, params).pipe(
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
      this.OutcomingDocumentService.addDocument(formData, params).pipe(
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

  // close(): void {
  //   this.dialogRef.close(true);
  // }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create a preview URL for the selected file
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);  // Read the file as a data URL for preview
    }
  }

  async downloadFileAndAppend(fileUrl: string, formData: FormData): Promise<void> {
    const fileBlob = await this.http.get(fileUrl, { responseType: 'blob' }).toPromise() as Blob;      
    const fileName = fileUrl.split('/').pop();
    formData.append('FileScanUrl', fileBlob, fileName);
  }
}
