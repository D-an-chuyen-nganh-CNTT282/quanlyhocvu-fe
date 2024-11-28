import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { IncomingDocumentComponent } from '../../components/incoming-document/incoming.document.component';
import { OutComingDocumentComponent } from 'src/app/components/outcoming-document/outcoming.document.component';
import { StudentComponent } from 'src/app/components/student/student.component';
import { ExtracurricularActivitiesComponent } from 'src/app/components/extracurricular-activities/extracurricular.activities.component';
import { StudentExpectationsComponent } from 'src/app/components/student-expectations/student.expectations.component';
import { LecturerComponent } from 'src/app/components/lecturer/lecturer.component';
import { LecturerPlanComponent } from 'src/app/components/lecturer-plan/lecturer.plan.component';
import { TeachingScheduleComponent } from 'src/app/components/teaching-schedule/teaching.schedule.component';
import { LecturerActivitiesComponent } from 'src/app/components/lecturer-activities/lecturer.activities.component';
import { BusinessComponent } from 'src/app/components/business/business.component';
import { BusinessCollaboratonComponent } from 'src/app/components/business-collaboraton/business.collaboraton.component';
import { BusinessActivitiesComponent } from 'src/app/components/business-activities/business.activities.component';
import { InternshipComponent } from 'src/app/components/internship/internship.component';
import { AlumniComponent } from 'src/app/components/alumni/alumni.component';
import { CompanyComponent } from 'src/app/components/company/company.component';
import { AlumniCompanyComponent } from 'src/app/components/alumni-company/alumni.company.component';
import { AlumniActivitiesComponent } from 'src/app/components/alumni-activities/alumni.activities.component';
import { UserComponent } from 'src/app/components/user/user.component';
import { ActivityComponent } from 'src/app/components/activity/activity.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'tables',
        component: AppTablesComponent,
      },
      {
        path: 'incoming-document',
        component: IncomingDocumentComponent,
      },
      {
        path: 'outcoming-document',
        component: OutComingDocumentComponent,
      },
      {
        path: 'student',
        component: StudentComponent,
      },
      {
        path: 'extracurricular-activities',
        component: ExtracurricularActivitiesComponent,
      },
      {
        path: 'student-expectations',
        component: StudentExpectationsComponent,
      },
      {
        path: 'lecturer',
        component: LecturerComponent,
      },
      {
        path: 'lecturer-plan',
        component: LecturerPlanComponent,
      },
      {
        path: 'teaching-schedule',
        component: TeachingScheduleComponent,
      },
      {
        path: 'lecturer-activity',
        component: LecturerActivitiesComponent,
      },
      {
        path: 'business',
        component: BusinessComponent,
      },
      {
        path: 'business-collbaboraton',
        component: BusinessCollaboratonComponent,
      },
      {
        path: 'business-activities',
        component: BusinessActivitiesComponent,
      },
      {
        path: 'internship',
        component: InternshipComponent,
      },
      {
        path: 'alumni',
        component: AlumniComponent,
      },
      {
        path: 'company',
        component: CompanyComponent,
      },
      {
        path: 'alumni-company',
        component: AlumniCompanyComponent,
      },
      {
        path: 'alumni-activities',
        component: AlumniActivitiesComponent,
      },
      {
        path: 'user-management',
        component: UserComponent,
      },
      {
        path: 'activities',
        component: ActivityComponent,
      },
    ],
  },
];
