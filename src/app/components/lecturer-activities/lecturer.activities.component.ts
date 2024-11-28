import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BaseComponent } from '../base/base.component';
import { finalize, firstValueFrom } from 'rxjs';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { Lecture } from 'src/app/models/lecture';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { Activity } from 'src/app/models/activity';
import { LecturerActivitiesDialogComponent } from './lecturer.activities.dialog.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-lecturer-activities',
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
    MatCardModule
  ],
  templateUrl: './lecturer.activities.component.html',
  styleUrl: './lecturer.activities.component.scss'
})
export class LecturerActivitiesComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['lecturerName', 'activitiesName', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  lecturers: Lecture[] = [];
  activities: Activity[] = [];

  constructor() {
    super();
  }
  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getLecturers(),
    this.getActivities()
    ]);
    this.fetchLecturerActivities();
    
  }

  fetchLecturerActivities(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.lecturerActivitiesService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { lecturerId: string; activitiesId: string; }) => {
          const lecture = this.lecturers.find(l => l.id === item.lecturerId);
          const activity = this.activities.find(a => a.id === item.activitiesId);
          return { ...item, lecturerName: lecture ? lecture.lecturerName : '', activitiesName: activity ? activity.name : '' };
        });
        this.dataSource.data = items;
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
    this.fetchLecturerActivities();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(LecturerActivitiesDialogComponent, {
      width: '800px',
      data: {
        ...data,
        lecturers: this.lecturers,
        activities: this.activities,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchLecturerActivities();
    });
  }

  delete(param: HttpParams): void {
    console.log({param})
    if (confirm('Are you sure?')) {
      this.lecturerActivitiesService.delete(param).subscribe(() => {
        this.fetchLecturerActivities();
      });
    }
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
      alert('Failed to load lecturers. Please try again.');
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
      alert('Failed to load activities. Please try again.');
    }
  }
}
