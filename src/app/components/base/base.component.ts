import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { ToastService } from '../../services/toast.service';
// import { CategoryService } from '../../services/category.service';
// import { ProductService } from '../../services/product.service';
// import { ActivatedRoute } from '@angular/router';
// import { TokenService } from '../../services/token.service';
// import { RoleService } from '../../services/role.service';
// import { CartService } from '../../services/cart.service';
// import { CouponService } from '../../services/coupon.service';
// import { OrderService } from '../../services/order.service';
import { Location } from '@angular/common';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/services/spinner.service';
import { IncomingDocumentService } from 'src/app/services/incoming.document.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TokenService } from 'src/app/services/token.service';
import { OutcomingDocumentService } from 'src/app/services/outcoming.document.service';
import { StudentService } from 'src/app/services/student.service';
import { LectureService } from 'src/app/services/lecture.service';
import { ExtracurricularActivitiesService } from 'src/app/services/extracurricular.activities.service';
import { ActivityService } from 'src/app/services/activity.service';
import { StudentExpectationsService } from 'src/app/services/student.expectations.service';
import { LecturerPlanService } from 'src/app/services/lecturer.plan.service';
import { TeachingScheduleService } from 'src/app/services/teaching.schedule.service';
import { LecturerActivitiesService } from 'src/app/services/lecturer.activities.service';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessCollaborationService } from 'src/app/services/business.collaboraton.service';
import { BusinessActivitiesService } from 'src/app/services/business.activities.service';
import { InternshipService } from 'src/app/services/internship.service';
import { AlumniService } from 'src/app/services/Alumni.service';
import { CompanyService } from 'src/app/services/company.service';
import { AlumniCompanyService } from 'src/app/services/alumni.company.service';
import { AlumniActivitiesService } from 'src/app/services/alumni.activities.service';
import { RoleService } from 'src/app/services/role.service';
// import { AuthService } from '../../services/auth.service';

export class BaseComponent {
    // toastService = inject(ToastService);
    router: Router = inject(Router);
    // categoryService: CategoryService = inject(CategoryService);
    // productService: ProductService = inject(ProductService);
    tokenService: TokenService = inject(TokenService);
    // activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    userService: UserService = inject(UserService);
    // roleService: RoleService = inject(RoleService);
    // cartService: CartService = inject(CartService);
    // couponService = inject(CouponService);
    // orderService = inject(OrderService);
    // authService = inject(AuthService);
    document: Document = inject(DOCUMENT);
    location: Location = inject(Location);
    matDialog: MatDialog = inject(MatDialog);
    IncomingDocumentService: IncomingDocumentService = inject(IncomingDocumentService);
    OutcomingDocumentService: OutcomingDocumentService = inject(OutcomingDocumentService);
    DepartmentService: DepartmentService = inject(DepartmentService);
    spinnerService: SpinnerService = inject(SpinnerService);
    studentService: StudentService = inject(StudentService);
    lectureService: LectureService = inject(LectureService);
    extracurricularActivitiesService: ExtracurricularActivitiesService = inject(ExtracurricularActivitiesService);
    activityService: ActivityService = inject(ActivityService);
    studentExpectationsService: StudentExpectationsService = inject(StudentExpectationsService);
    lecturerPlanService: LecturerPlanService = inject(LecturerPlanService);
    lecturerActivitiesService: LecturerActivitiesService = inject(LecturerActivitiesService);
    teachingScheduleService: TeachingScheduleService = inject(TeachingScheduleService);
    businessService: BusinessService = inject(BusinessService);
    businessCollaborationService: BusinessCollaborationService = inject(BusinessCollaborationService);
    businessActivitiesService: BusinessActivitiesService = inject(BusinessActivitiesService);
    internshipService: InternshipService = inject(InternshipService);
    alumniService: AlumniService = inject(AlumniService);
    companyService: CompanyService = inject(CompanyService);
    alumniCompanyService: AlumniCompanyService = inject(AlumniCompanyService);
    alumniActivitiesService: AlumniActivitiesService = inject(AlumniActivitiesService);
    roleService: RoleService = inject(RoleService);

    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
        const maxVisiblePages = 5;
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(currentPage - halfVisiblePages, 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }
        return new Array(endPage - startPage + 1).fill(0)
            .map((_, index) => startPage + index);
    }
}


