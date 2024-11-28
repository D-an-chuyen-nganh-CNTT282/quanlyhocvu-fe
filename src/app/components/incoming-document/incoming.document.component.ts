import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { IncomingDocumentDialogComponent } from './Incoming.document.dialog.component'; // Make sure this path is correct
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Department } from 'src/app/models/department';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { VI_DATE_FORMATS } from '../utils/date.format';
import localeVi from '@angular/common/locales/vi';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
import { MatCard, MatCardModule } from '@angular/material/card';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-incoming-document',
    standalone: true,
  templateUrl: './incoming.document.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepicker,
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
export class IncomingDocumentComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['incomingDocumentTitle', 'incomingDocumentContent', 'receivedDate', 'dueDate', 'incomingDocumentProcessingStatuss', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  departments: Department[] = [];

  // Filter properties
  filterTitle: string = '';
  filterDueDate: Date | null = null;

  constructor(
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchDocuments();
    this.getDepartment();
  }

  fetchDocuments(): void {
    this.spinnerService.showSpinner();
    const filters = {
      title: this.filterTitle || '',
      dueDate: this.filterDueDate ? this.datePipe.transform(this.filterDueDate, 'yyyy-MM-dd') : '',
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.IncomingDocumentService.getDocuments(filters).pipe(
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
    if (this.filterDueDate) {
      const formattedDate = this.datePipe.transform(this.filterDueDate, 'yyyy-MM-dd');
      console.log('Selected Date:', formattedDate); // Logs in dd-MM-yyyy format
    }
    this.pageIndex = 0; // Reset to the first page when filter changes
    this.fetchDocuments();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchDocuments();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(IncomingDocumentDialogComponent, {
      width: '800px',
      data: {
        ...data,
        departments: this.departments,
        departmentId: data?.departmentId || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchDocuments();
    });
  }

  // Delete a document
  deleteDocument(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xoá công văn này?')) {
      this.IncomingDocumentService.deleteDocument(id).subscribe(() => {
        this.fetchDocuments();
      });
    }
  }
    getDepartment(): void {
    this.DepartmentService.getDepartment(1000, 1).subscribe((rs:any) => {
      this.departments = rs.data.items;
      console.log({
        'departments': this.departments
      })
    })
  }
}
