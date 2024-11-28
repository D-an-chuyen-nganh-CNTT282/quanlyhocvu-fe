import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { VI_DATE_FORMATS } from '../utils/date.format';
import localeVi from '@angular/common/locales/vi';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ActivityDialogComponent } from './activity.dialog.component';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-activity',
    standalone: true,
    templateUrl: './activity.component.html',
    styleUrl: './activity.component.scss',
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
export class ActivityComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'eventDate', 
    'location', 
    'eventTypes', 
    'description',
    'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  constructor(
    private datePipe: DatePipe
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.fetchActivity();
  }

  fetchActivity(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.activityService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        this.dataSource.data = response.data.items;
        this.totalItems = response.data.totalItems;
      },
      error: (error: ApiResponseError) => {
        alert(error?.error?.title || 'Có lỗi xảy ra');
      }
    });
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.fetchActivity();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchActivity();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(ActivityDialogComponent, {
      width: '800px',
      data: {
        ...data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchActivity();
    });
  }

  delete(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.activityService.delete(id).subscribe(() => {
        this.fetchActivity();
      });
    }
  }
}

