import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { StatisticsService } from 'src/app/services/statistics.service';
import { StatisticsCount } from 'src/app/models/statistics.count';
import { StatisticsUpcoming } from 'src/app/models/statistics.upcoming';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    NgApexchartsModule,
    MatButtonModule,
    TablerIconsModule,
    MatMenuModule,
    CommonModule,
    MatProgressBarModule,
    NgScrollbarModule
  ],
  templateUrl: './dashboard.component.html',
})
export class DashBoardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  constructor(private statisticService: StatisticsService) {
  }
  ngOnInit(): void {
    this.getStatisticCount();
    this.getStatisticUpcoming();
  }
  statisticCount: StatisticsCount;
  statisticUpcoming: StatisticsUpcoming[] = [];
  displayedColumns: string[] = ['name', 'eventDate', 'location', 'eventTypes', 'description'];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getStatisticUpcoming();
  }

  getStatisticCount(): void {
    try {
      this.statisticService.getEntityCounts().subscribe((response: StatisticsCount) => {
        this.statisticCount = response;
      })
    } catch (error) {
      alert('Failed to getstatisticCount. Please try again.');
    }
  }
  getStatisticUpcoming(): void {
    try {
      const filters = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex + 1
      };
      this.statisticService.getUpcomingActivities(filters).subscribe((response: any) => {
        this.statisticUpcoming = response?.items || [];
        this.totalItems = response?.totalItems;
      })
    } catch (error) {
      alert('Failed to getStatisticUpcoming. Please try again.');
    }
  }

}
