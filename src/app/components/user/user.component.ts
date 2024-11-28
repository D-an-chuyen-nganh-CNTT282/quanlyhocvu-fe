import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { VI_DATE_FORMATS } from '../utils/date.format';
import localeVi from '@angular/common/locales/vi';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { UserDialogComponent } from './user.dialog.component';
import { Role } from 'src/app/models/roles';
import { ChangePasswordDialogComponent } from './change-password/change.password';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-user',
    standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: VI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ]
})
export class UserComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email', 
    'phoneNumber', 
    'roleName', 
    'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  roles: Role[] = [];
  userId: string;

  constructor(
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.getRoles();
  }

  fetchUsers(): void {
    this.spinnerService.showSpinner();
    const params = new GetDTO({
      pageSize: this.pageSize,
      page: this.pageIndex + 1
    }).cleanParams();
    this.userService.getUsers(params).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        this.dataSource.data = response.data.items;
        this.totalItems = response.data.totalItems;
      },
      error: (error: ApiResponseError) => {
        alert(error?.error?.title || 'co loi xay ra');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchUsers();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(UserDialogComponent, {
      width: '800px',
      data: {
        ...data, roles: this.roles
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchUsers();
    });
  }

  openDialogResetPassword(data?: any): void {
    const dialogRef = this.matDialog.open(ChangePasswordDialogComponent, {
      width: '800px',
      data: {
        ...data,
        // userId: this.tokenService.getUserId()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchUsers();
    });
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe((response: any) => {
      this.roles = response.data;
    })
  }
}


