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
import { LecturerPlanDialogComponent } from './lecturer.plan.dialog.component';
import { Lecture } from 'src/app/models/lecture';
import { GetDTO } from 'src/app/dtos/user/get.dto';

@Component({
  selector: 'app-lecturer-plan',
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
  templateUrl: './lecturer.plan.component.html',
  styleUrl: './lecturer.plan.component.scss'
})
export class LecturerPlanComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['planContent', 'startDate', 'endDate', 'note', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  lectures: Lecture[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.fetchLecturerPlan();
    // this.getLectures();
  }

  fetchLecturerPlan(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.lecturerPlanService.get(filters).pipe(
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
    this.fetchLecturerPlan();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(LecturerPlanDialogComponent, {
      width: '800px',
      data: { ... data, lectures: this.lectures}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchLecturerPlan();
    });
  }

  delete(id: string): void {
    if (confirm('Are you sure?')) {
      this.lecturerPlanService.delete(id).subscribe(() => {
        this.fetchLecturerPlan();
      });
    }
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
}

