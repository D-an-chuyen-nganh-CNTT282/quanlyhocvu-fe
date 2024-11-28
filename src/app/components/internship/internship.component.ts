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
import { Business } from 'src/app/models/business';
import { Student } from 'src/app/models/student';
import { InternshipDialogComponent } from './internship.dialog.component';

@Component({
  selector: 'app-internship',
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
  templateUrl: './internship.component.html',
  styleUrl: './internship.component.scss'
})
export class InternshipComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['businessName', 'studentName', 'startDate', 'endDate', 'remark', 'rating', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  business: Business[] = [];
  students: Student[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getBusiness(),
      this.getStudents()
    ])
    this.fetchInternship();
  }

  fetchInternship(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.internshipService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { businessId: string; studentId: string; }) => {
          const business = this.business.find(b => b.id === item.businessId);
          const student = this.students.find(s => s.id === item.studentId);
          return { ...item, businessName: business ? business.businessName : '', studentName: student ? student.studentName : '' };
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
    this.fetchInternship();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(InternshipDialogComponent, {
      width: '800px',
      data: { ... data, business: this.business, students: this.students}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchInternship();
    });
  }

  delete(params: any): void {
    if (confirm('Are you sure?')) {
      this.internshipService.delete(params).subscribe(() => {
        this.fetchInternship();
      });
    }
  }

  async getBusiness(): Promise<void> {
    const params = new GetDTO({
      index: 1,
      pageSize: 1000
    }).cleanParams();
  
    try {
      const response: any = await firstValueFrom(this.businessService.get(params));
      this.business = response?.data?.items || [];
    } catch (error) {
      alert('Failed to load business. Please try again.');
    }
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




