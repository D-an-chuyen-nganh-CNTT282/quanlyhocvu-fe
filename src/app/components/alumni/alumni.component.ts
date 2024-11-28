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
import { MatCard, MatCardModule } from '@angular/material/card';
import { Lecture } from 'src/app/models/lecture';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { AlumniDialogComponent } from './alumni.dialog.component';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-alumni',
    standalone: true,
    templateUrl: './alumni.component.html',
    styleUrl: './alumni.component.scss',
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
export class AlumniComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'alumniName',
    'dayOfBirth', 
    'alumniGender', 
    'alumniAddress', 
    'alumniEmail',
    'alumniPhone',
    'alumniMajor',
    'alumniCourse',
    'previousClass',
    'graduationDay',
    'lecturerName',
    'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  lecturers: Lecture[] = [];
  filterAlumniName: string = '';
  filterAlumniMajor: string = '';
  filterAlumniCourse: string = '';

  constructor(
    private datePipe: DatePipe
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getLecturers()]);
    this.fetchAlumni();
  }

  fetchAlumni(): void {
    this.spinnerService.showSpinner();
    const filters = {
      alumniName: this.filterAlumniName || '',
      alumniMajor: this.filterAlumniMajor || '',
      alumniCourse: this.filterAlumniCourse || '',
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.alumniService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { lecturerId: string; }) => {
          const lecture = this.lecturers.find(l => l.id === item.lecturerId);
          return { ...item, lecturerName: lecture ? lecture.lecturerName : '' };
        });
        this.dataSource.data = items;
        this.totalItems = response.data.totalItems;
      },
      error: (error: ApiResponseError) => {
        alert(error?.error?.title || 'Có lỗi xảy ra');
      }
    });
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.fetchAlumni();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchAlumni();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(AlumniDialogComponent, {
      width: '800px',
      data: {
        ...data,
        lecturers: this.lecturers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchAlumni();
    });
  }

  async getLecturers(): Promise<void> {
    const params = new GetDTO({
      page: 1,
      pageSize: 1000
    }).cleanParams();
  
    try {
      const response: any = await firstValueFrom(this.lectureService.getLectures(params));
      this.lecturers = response?.data?.items || [];
    } catch (error) {
      alert('Lỗi tải danh sách giảng viên. Vui lòng thử lại sau.');
    }
  }
}

