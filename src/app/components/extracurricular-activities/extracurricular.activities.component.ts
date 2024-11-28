import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize, firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { Student } from 'src/app/models/student';
import { ExtracurricularActivitiesDialogComponent } from './extracurricular.activities.dialog.component';
import { Activity } from 'src/app/models/activity';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-extracurricular.activities',
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
  templateUrl: './extracurricular.activities.component.html',
  styleUrl: './extracurricular.activities.component.scss'
})
export class ExtracurricularActivitiesComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'activitiesName', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  students: Student[] = [];
  activities: Activity[] = [];

  constructor() {
    super();
  }
  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getStudents(),
      this.getActivities()
    ])
    this.fetchExtracurricularActivities();

  }

  fetchExtracurricularActivities(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.extracurricularActivitiesService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { studentId: string; activitiesId: string; }) => {
          const student = this.students.find(s => s.id === item.studentId);
          const activity = this.activities.find(a => a.id === item.activitiesId);
          return { ...item, studentName: student ? student.studentName : '', activitiesName: activity ? activity.name : '' };
        });
        this.dataSource.data = items;
        this.totalItems = response.data.totalItems;
      },
      error: (error: ApiResponseError) => {
        alert(error?.error?.title || 'có lỗi xảy ra');
      }
    });
  }

  // Filter method
  applyFilter(): void {
    this.pageIndex = 0; // Reset to the first page when filter changes
    this.fetchExtracurricularActivities();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchExtracurricularActivities();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(ExtracurricularActivitiesDialogComponent, {
      width: '800px',
      data: {
        ...data,
        students: this.students,
        activities: this.activities,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchExtracurricularActivities();
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
      alert('Lỗi khi tải danh sách sinh viên. Vui lòng thử lại sau.');
    }
  }
  async getActivities(): Promise<void> {
    const params = {
      page: 1,
      pageSize: 1000
    };
  
    try {
      const response: any = await firstValueFrom(this.activityService.get(params));
      this.activities = response?.data?.items || [];
    } catch (error) {
      alert('Lỗi khi tải danh sách hoạt động. Vui sách thử lại sau.');
    }
  }
}
