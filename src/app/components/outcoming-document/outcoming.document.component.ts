import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Department } from 'src/app/models/department';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { VI_DATE_FORMATS } from '../utils/date.format';
import localeVi from '@angular/common/locales/vi';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
import { OutcomingDocumentDialogComponent } from './outcoming.document.dialog.component';
import { User } from 'src/app/models/user';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-outcoming-document',
  standalone: true,
  templateUrl: './outcoming.document.component.html',
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
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: VI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ]
})
export class OutComingDocumentComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['outgoingDocumentTitle', 'outgoingDocumentContent', 'sendDate', 'recipientEmail',
    'outgoingDocumentProcessingStatuss', 'dueDate','actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  departments: Department[] = [];
  users: User[] = [];

  // Filter properties
  filterTitle: string = '';
  filterUser: string = '';
  filterDepartment: string = '';

  constructor(
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchDocuments();
    this.getDepartment();
    this.getUsers();
  }

  fetchDocuments(): void {
    this.spinnerService.showSpinner();
    const filters = {
      title: this.filterTitle || '',
      departmentId: this.filterDepartment || '',
      userId: this.filterUser || '',
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.OutcomingDocumentService.getDocuments(filters).pipe(
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

  // Filter method
  applyFilter(): void {
    this.pageIndex = 0; // Reset to the first page when filter changes
    this.fetchDocuments();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchDocuments();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(OutcomingDocumentDialogComponent, {
      width: '800px',
      data: {
        ...data,
        departments: this.departments,
        departmentId: data?.departmentId || '',
        users: this.users,
        userId: data?.userId || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchDocuments();
    });
  }

  getDepartment(): void {
    this.DepartmentService.getDepartment(1000, 1).subscribe((rs: any) => {
      this.departments = rs.data.items;
      console.log({
        'departments': this.departments,
      })
    })
  }

  getUsers(): void {
    const params = new GetDTO({
      page: 1,
      pageSize: 1000
    }).cleanParams();
    this.userService.getUsers(params).subscribe((rs: any) => {
      this.users = rs.data.items;
      console.log({
        'users': this.users
      })
    })
  }
}
