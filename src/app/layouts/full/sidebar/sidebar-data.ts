import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Management',
    divider: true
  },
  {
    displayName: 'Quản lý hoạt động',
    iconName: 'solar:file-text-line-duotone',
    route: '/app-qlhv/activities',
    roles: ['Trưởng khoa', 'Phó trưởng khoa'],
  },
  {
    displayName: 'Quản lý công văn đến',
    iconName: 'solar:file-text-line-duotone',
    route: '/app-qlhv/incoming-document',
    roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa'],
  },
  {
    displayName: 'Quản lý công văn đi',
    iconName: 'solar:file-text-line-duotone',
    route: '/app-qlhv/outcoming-document',
    roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa'],
  },
  {
    displayName: 'Quản lý sinh viên',
    iconName: 'solar:file-text-line-duotone',
    roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa'],
    children: [
      {
        displayName: 'Hồ sơ',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/student',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa'],
      },
      {
        displayName: 'Hoạt động ngoại khóa',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/extracurricular-activities',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa'],
      },
      {
        displayName: `Yêu cầu sinh viên`,
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/student-expectations',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa'],
      },
    ]
  },
  // {
  //   displayName: 'Students',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/student',
  // },
  // {
  //   displayName: 'Activities',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/extracurricular-activities',
  // },
  // {
  //   displayName: `Student's Expectations`,
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/student-expectations',
  // },
  {
    displayName: 'Quản lý giảng viên',
    iconName: 'solar:file-text-line-duotone',
    roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giảng viên'],
    children: [
      {
        displayName: 'Hồ sơ',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/lecturer',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn'],
      },
      {
        displayName: 'Kế hoạch',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/lecturer-plan',
        roles: ['Giảng viên'],
      },
      {
        displayName: 'Hoạt động',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/lecturer-activity',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn'],
      },
      {
        displayName: 'Điều phối giảng dạy',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/teaching-schedule',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn'],
      },
    ]
  },
  // {
  //   displayName: 'Lecturers',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/lecturer',
  // },
  // {
  //   displayName: 'Lecturer Plan',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/lecturer-plan',
  // },
  // {
  //   displayName: 'Lecturer Activity',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/lecturer-activity',
  // },
  // {
  //   displayName: 'Teaching Schedule',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/teaching-schedule',
  // },
  {
    displayName: 'Quản lý doanh nghiệp',
    iconName: 'solar:file-text-line-duotone',
    roles: ['Trưởng khoa', 'Phó trưởng khoa'],
    children: [
      {
        displayName: 'Thông tin',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/business',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
      {
        displayName: 'Hợp tác',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/business-collbaboraton',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
      {
        displayName: 'Sự kiện',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/business-activities',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
      {
        displayName: 'Thực tập',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/internship',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
    ]
  },
  // {
  //   displayName: 'Business',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/business',
  // },
  // {
  //   displayName: 'Business Collaboraton',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/business-collbaboraton',
  // },
  // {
  //   displayName: 'Business Activities',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/business-activities',
  // },
  // {
  //   displayName: 'Internship',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/internship',
  // },
  {
    displayName: 'Quản lý cựu sinh viên',
    iconName: 'solar:file-text-line-duotone',
    roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa', 'Giảng viên'],
    children: [
      {
        displayName: 'Hồ sơ',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/alumni',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
      {
        displayName: 'Công ty',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/company',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
      {
        displayName: 'Nơi làm việc',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/alumni-company',
        roles: ['Trưởng khoa', 'Phó trưởng khoa'],
      },
      {
        displayName: 'Sự kiện',
        iconName: 'solar:file-text-line-duotone',
        route: '/app-qlhv/alumni-activities',
        roles: ['Trưởng khoa', 'Phó trưởng khoa', 'Trưởng bộ môn', 'Giáo vụ khoa', 'Giảng viên'],
      },
    ]
  },
  // {
  //   displayName: 'Alumni',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/alumni',
  // },
  // {
  //   displayName: 'Company',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/company',
  // },
  // {
  //   displayName: 'Alumni Company',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/alumni-company',
  // },
  // {
  //   displayName: 'Alumni Activities',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/alumni-activities',
  // },
  {
    displayName: 'Quản trị người dùng',
    iconName: 'solar:file-text-line-duotone',
    route: '/app-qlhv/user-management',
    roles: ['Admin'],
  },
  // {
  //   displayName: 'Badge',
  //   iconName: 'solar:archive-minimalistic-line-duotone',
  //   route: '/app-qlhv/badge'
  // },
  // {
  //   displayName: 'Chips',
  //   iconName: 'solar:danger-circle-line-duotone',
  //   route: '/app-qlhv/chips',
  // },
  // {
  //   displayName: 'Lists',
  //   iconName: 'solar:bookmark-square-minimalistic-line-duotone',
  //   route: '/app-qlhv/lists',
  // },
  // {
  //   displayName: 'Menu',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/menu',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'solar:text-field-focus-line-duotone',
  //   route: '/app-qlhv/tooltips',
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/app-qlhv/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'solar:tablet-line-duotone',
  //   route: '/app-qlhv/tables',
  // },
  // {
  //   navCap: 'Auth',
  //   divider: true
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'solar:login-3-line-duotone',
  //   route: '/authentication/login',
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'solar:user-plus-rounded-line-duotone',
  //   route: '/authentication/register',
  // },
  // {
  //   navCap: 'Extra',
  //   divider: true
  // },
  // {
  //   displayName: 'Icons',
  //   iconName: 'solar:sticker-smile-circle-2-line-duotone',
  //   route: '/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'solar:planet-3-line-duotone',
  //   route: '/extra/sample-page',
  // },
];
