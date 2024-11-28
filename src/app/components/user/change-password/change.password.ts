import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
@Component({
    selector: 'app-changepassword',
    templateUrl: './change.password.html',
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
export class ChangePasswordDialogComponent extends BaseComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super();
        this.form = this.fb.group({
            userId: data.userId,
            name: [{ value: data.name, disabled: true }, Validators.required],
            email: [{ value: data.email, disabled: true }, Validators.required],
            phoneNumber: [{ value: data.phoneNumber, disabled: true }, Validators.required],
            password: [data.password, Validators.required],
        });
    }

    async save(): Promise<void> {
        this.spinnerService.showSpinner();
        if (this.form.invalid) {
            this.spinnerService.hideSpinner();
            return;
        }
        let body: { [key: string]: any } = {};
        console.log({'this.form.value': this.form.getRawValue()})
        Object.keys(this.form.getRawValue()).forEach(key => body[key] = this.form.getRawValue()[key]);

        this.userService.resetPassword(this.data.id, body).pipe(
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