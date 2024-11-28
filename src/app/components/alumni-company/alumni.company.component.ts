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
import { finalize, firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { GetDTO } from 'src/app/dtos/user/get.dto';
import { AlumniCompanyDialogComponent } from './alumni.company.dialog.component';
import { Alumni } from 'src/app/models/alumni';
import { Company } from 'src/app/models/company';
registerLocaleData(localeVi, 'vi');

@Component({
  selector: 'app-alumni-company',
    standalone: true,
    templateUrl: './alumni.company.component.html',
    styleUrl: './alumni.company.component.scss',
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
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: VI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ]
})
export class AlumniCompanyComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'alumniName',
    'companyName', 
    'startDate', 
    'endDate', 
    'duty',
    'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  alumni: Alumni[] = [];
  company: Company[] = [];

  constructor(
    private datePipe: DatePipe
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getAlumni(),
    this.getCompany()
    ]);
    this.fetchAlumniCompany();
  }

  fetchAlumniCompany(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex + 1
    };
    this.alumniCompanyService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { alumniId: string; companyId: string; }) => {
          const alumni = this.alumni.find(a => a.id === item.alumniId);
          const company = this.company.find(c => c.id === item.companyId);
          return { ...item, alumniName: alumni ? alumni.alumniName : '', companyName: company ? company.companyName : '' };
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
    this.fetchAlumniCompany();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(AlumniCompanyDialogComponent, {
      width: '800px',
      data: {
        ...data,
        company: this.company,
        alumni: this.alumni
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchAlumniCompany();
    });
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
  async getCompany(): Promise<void> {
    const params = new GetDTO({
      index: 1,
      pageSize: 1000
    }).cleanParams();
    try {
      const response: any = await firstValueFrom(this.companyService.get(params));
      this.company = response?.data?.items || [];
    } catch (error) {
      alert('Lỗi khi tải danh sách công ty. Vui lòng thử lại sau.');
    }
  }
  delete(element: any): void {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.alumniCompanyService.delete(element).subscribe(() => {
        this.fetchAlumniCompany();
      });
    }
  }
}


