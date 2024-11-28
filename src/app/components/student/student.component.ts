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
import { User } from 'src/app/models/user';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { MatSelectModule } from '@angular/material/select';
import { Student } from 'src/app/models/student';
import { Lecture } from 'src/app/models/lecture';
import { StudentDialogComponent } from './student.dialog.component';
import { MatCardModule } from '@angular/material/card';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-student',
  standalone: true,
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
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: VI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ]
})
export class StudentComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'gpa', 'dayOfBirth', 'studentGender', 'studentAddress', 'studentEmail',
    'studentPhone', 'studentMajor', 'class', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  students: Student[] = [];
  lectures: Lecture[] = [];

  // Filter properties
  filterStudentName: string = '';
  filterStudentMajor: string = '';
  filterClass: string = '';
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.fetchStudents();
    this.getLectures();
  }

  fetchStudents(): void {
    this.spinnerService.showSpinner();
    const filters = {
      name: this.filterStudentName || '',
      studentClass: this.filterClass || '',
      studentMajor: this.filterStudentMajor || '',
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.studentService.getStudents(filters).pipe(
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
    this.fetchStudents();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchStudents();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(StudentDialogComponent, {
      width: '800px',
      data: {
        ...data,
        lectures: this.lectures,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchStudents();
    });
  }

  getLectures(): void {
    const params = new GetDTO({
      page: 1,
      pageSize: 1000
    }).cleanParams();
    this.lectureService.getLectures(params).subscribe((rs: any) => {
      this.lectures = rs.data.items;
      console.log({
        'lectures': this.lectures
      })
    })
  }

  deleteStudent(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xoá sinh vien?')) {
      this.studentService.deleteStudent(id).subscribe(() => {
        this.fetchStudents();
      });
    }
  }

}
