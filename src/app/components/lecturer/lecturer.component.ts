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
import { finalize } from 'rxjs';
import { ApiResponse, ApiResponseError } from 'src/app/responses/api.response';
import { LecturerDialogComponent } from './lecturer.dialog.component';

@Component({
  selector: 'app-lecturer',
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
  templateUrl: './lecturer.component.html',
  styleUrl: './lecturer.component.scss'
})
export class LecturerComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['lecturerName', 'dayOfBirth', 'lecturerGender', 'lecturerEmail', 'lecturerPhone', 'lecturerAddress', 'expertise', 'personalWebsiteLink', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  // Filter properties
  filterTitle: string = '';
  filterDueDate: Date | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.fetchLecturers();
  }

  fetchLecturers(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.lectureService.getLectures(filters).pipe(
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

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchLecturers();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(LecturerDialogComponent, {
      width: '800px',
      data: { ... data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchLecturers();
    });
  }

  deleteLecturer(id: string): void {
    if (confirm('Are you sure?')) {
      this.lectureService.deleteLecture(id).subscribe(() => {
        this.fetchLecturers();
      });
    }
  }
}
