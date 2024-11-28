import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [TranslateModule, MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  //@HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;
  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.loadUserRoles();
  }
  expanded: boolean = false;
  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {});
  }

  onItemSelected(item: NavItem) {
    if (item.children) {
      this.expanded = !this.expanded; // Toggle submenu
    } else {
      this.router.navigate([item.route]);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  onSubItemSelected(item: NavItem) {
    
  }

    // Toggle open/close sub-menu
    toggleSubMenu(item: any) {
      if (item.children) {
        item.isOpen = !item.isOpen; // Toggle the isOpen property to show/hide sub-menu
      }
    }
    userRoles: string[] = [];
    loadUserRoles() {
      // Lấy thông tin từ localStorage (hoặc sessionStorage)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      this.userRoles = userData.roles || [];
    }
  
    hasAccess(itemRoles: string[] | undefined): boolean {
      // Nếu itemRoles không được định nghĩa hoặc là một mảng rỗng, mặc định trả về true
      if (!itemRoles || itemRoles.length === 0) {
        return true;
      }
      // Kiểm tra nếu user có ít nhất 1 quyền trùng với roles của menu
      return itemRoles.some(role => this.userRoles.includes(role));
    }
}
