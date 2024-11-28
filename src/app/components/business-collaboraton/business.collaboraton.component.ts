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
import { BusinessCollaboratonDialogComponent } from './business.collaboraton.dialog.component';

@Component({
  selector: 'app-business-collaboraton',
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
  templateUrl: './business.collaboraton.component.html',
  styleUrl: './business.collaboraton.component.scss'
})
export class BusinessCollaboratonComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['businessName', 'projectName', 'projectStatuss', 'result', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  business: Business[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.getBusiness()]);
    this.fetchBusinessCollaboraton();
    
  }

  fetchBusinessCollaboraton(): void {
    this.spinnerService.showSpinner();
    const filters = {
      pageSize: this.pageSize,
      index: this.pageIndex + 1
    };
    this.businessCollaborationService.get(filters).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    ).subscribe({
      next: (response: ApiResponse) => {
        const items = response.data.items.map((item: { businessId: string }) => {
          const business = this.business.find(b => b.id === item.businessId);
          return { ...item, businessName: business ? business.businessName : '' };
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
    this.fetchBusinessCollaboraton();
  }

  openDialog(data?: any): void {
    const dialogRef = this.matDialog.open(BusinessCollaboratonDialogComponent, {
      width: '800px',
      data: { ... data, business: this.business}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchBusinessCollaboraton();
    });
  }

  delete(params: any): void {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.businessCollaborationService.delete(params).subscribe(() => {
        this.fetchBusinessCollaboraton();
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
      alert('Lỗi khi tải danh sách doanh nghiệp. Vui lòng thử lại sau');
    }
  }
}


