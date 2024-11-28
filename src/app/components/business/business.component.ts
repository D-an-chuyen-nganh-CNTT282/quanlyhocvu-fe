import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { VI_DATE_FORMATS } from '../utils/date.format';
import localeVi from '@angular/common/locales/vi';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize, firstValueFrom } from 'rxjs';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { MatSelectModule } from '@angular/material/select';
import { Lecture } from 'src/app/models/lecture';
import { MatCardModule } from '@angular/material/card';
import { BusinessDialogComponent } from './business.dialog.component';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-business',
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
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss',
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: VI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ]
})
export class BusinessComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['lecturerName', 'businessName', 'businessAddress', 'businessPhone', 'businessEmail', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  lectures: Lecture[] = [];

  constructor() {
    super();
  }
  async ngOnInit(): Promise<void> {
    await Promise.all([this.getLectures()]);
    this.fetchBusiness();
    
  }

  fetchBusiness(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.businessService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { lecturerId: string }) => {
          const lecture = this.lectures.find(l => l.id === item.lecturerId);
          return { ...item, lecturerName: lecture ? lecture.lecturerName : '' };
        });
        this.dataSource.data = items;
        this.totalItems = response.data.totalItems;
      },
      error: (error: ApiResponseError) => {
        alert(error?.error?.title || 'có lỗi xảy ra');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchBusiness();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(BusinessDialogComponent, {
      width: '800px',
      data: {
        ...data,
        lectures: this.lectures,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchBusiness();
    });
  }

  async getLectures(): Promise<void> {
    const params = new GetDTO({
      page: 1,
      pageSize: 1000
    }).cleanParams();
  
    try {
      const response: any = await firstValueFrom(this.lectureService.getLectures(params));
      this.lectures = response?.data?.items || [];
    } catch (error) {
      alert('Lỗi khi tải danh sách giảng viên. Vui lòng thử lại sau');
    }
  }

  delete(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.businessService.delete(id).subscribe(() => {
        this.fetchBusiness();
      });
    }
  }

}

