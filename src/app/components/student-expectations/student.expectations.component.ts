import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
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
import { finalize, firstValueFrom } from 'rxjs';
import { Student } from 'src/app/models/student';
import { StudentExpectationsDialogComponent } from './student.expectations.dialog.component';
import { MatCardModule } from '@angular/material/card';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-incoming-document',
    standalone: true,
  templateUrl: './student.expectations.component.html',
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
export class StudentExpectationsComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'requestCategory', 'processingStatus', 'requestDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  students: Student[] = [];

  // Filter properties
  filterTitle: string = '';
  filterDueDate: Date | null = null;

  constructor(
    private datePipe: DatePipe
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.getStudents()]);
    this.fetchStudentExpectations();
  }

  fetchStudentExpectations(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.studentExpectationsService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { studentId: string; }) => {
          const student = this.students.find(s => s.id === item.studentId);
          return { ...item, studentName: student ? student.studentName : '' };
        });
        this.dataSource.data = items;
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
    this.fetchStudentExpectations();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchStudentExpectations();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(StudentExpectationsDialogComponent, {
      width: '800px',
      data: {
        ...data,
        students: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchStudentExpectations();
    });
  }

  async getStudents(): Promise<void> {
    const params = {
      page: 1,
      pageSize: 1000
    };
    try {
      const response: any = await firstValueFrom(this.studentService.getStudents(params));
      this.students = response?.data?.items || [];
    } catch (error) {
      alert('Error fetching students. Please try again.');
    }
  }
}

