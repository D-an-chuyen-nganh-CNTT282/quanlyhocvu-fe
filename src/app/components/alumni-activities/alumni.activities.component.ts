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
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { Activity } from 'src/app/models/activity';
import { Alumni } from 'src/app/models/alumni';
import { AlumniActivitiesDialogComponent } from './alumni.activities.dialog.component';

@Component({
  selector: 'app-alumni-activities',
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
  templateUrl: './alumni.activities.component.html',
  styleUrl: './alumni.activities.component.scss'
})
export class AlumniActivitiesComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['alumniName', 'activitiesName', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  alumni: Alumni[] = [];
  activities: Activity[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getAlumni(),
    this.getActivities()
    ]);
    this.fetchAlumniActivities();
    
  }

  fetchAlumniActivities(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.alumniActivitiesService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { alumniId: string; activitiesId: string; }) => {
          const alumni = this.alumni.find(a => a.id === item.alumniId);
          const activity = this.activities.find(a => a.id === item.activitiesId);
          return { ...item, alumniName: alumni ? alumni.alumniName : '', activitiesName: activity ? activity.name : '' };
        });
        this.dataSource.data = items;
        this.totalItems = response.data.totalItems;
      },
      error: (error: ApiResponseError) => {
        alert(error?.error?.title || 'Có lỗi xảy ra');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchAlumniActivities();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(AlumniActivitiesDialogComponent, {
      width: '800px',
      data: { ... data, alumni: this.alumni, activities: this.activities}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchAlumniActivities();
    });
  }

  delete(params: any): void {
    if (confirm('Are you sure?')) {
      this.alumniActivitiesService.delete(params).subscribe(() => {
        this.fetchAlumniActivities();
      });
    }
  }
  async getAlumni(): Promise<void> {
    const params = new GetDTO({
      pageIndex: 1,
      pageSize: 1000
    }).cleanParams();
    try {
      const response: any = await firstValueFrom(this.alumniService.get(params));
      this.alumni = response?.data?.items || [];
    } catch (error) {
      alert('Lỗi khi tải danh sách cựu sinh viên. Vui lòng thử lại sau.');
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
      alert('Lỗi khi tải danh sách hoạt động. Vui lòng thử lại sau.');
    }
  }
}




