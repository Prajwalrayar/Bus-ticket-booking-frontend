import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { TokenService } from '../../core/services/token-service';
import { APP_CONSTANTS } from '../../core/constants/app-constants';

interface AdminNavItem {
  icon: string;
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;
  readonly currentYear = new Date().getFullYear();

  readonly navItems: AdminNavItem[] = [
    { icon: 'bi-speedometer2', label: 'Dashboard', route: '/admin', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-people', label: 'Users', route: '/admin/users', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-person-badge', label: 'Staff', route: '/admin/staff', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-bus-front', label: 'Buses', route: '/admin/buses', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-signpost-2', label: 'Routes', route: '/admin/routes', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-calendar-range', label: 'Trips', route: '/admin/trips', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-ticket-perforated', label: 'Bookings', route: '/admin/bookings', roles: [APP_CONSTANTS.ROLES.ADMIN] },
    { icon: 'bi-journal-text', label: 'Audit Logs', route: '/admin/audit-logs', roles: [APP_CONSTANTS.ROLES.ADMIN] },
  ];

  readonly operatorNavItems: AdminNavItem[] = [
    { icon: 'bi-speedometer2', label: 'Dashboard', route: '/operator', roles: [APP_CONSTANTS.ROLES.BUS_OPERATOR] },
    { icon: 'bi-bus-front', label: 'My Buses', route: '/operator/buses', roles: [APP_CONSTANTS.ROLES.BUS_OPERATOR] },
    { icon: 'bi-calendar-range', label: 'Trips', route: '/operator/trips', roles: [APP_CONSTANTS.ROLES.BUS_OPERATOR] },
    { icon: 'bi-ticket-perforated', label: 'Bookings', route: '/operator/bookings', roles: [APP_CONSTANTS.ROLES.BUS_OPERATOR] },
  ];

  constructor(
    private authStateService: AuthStateService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  get userName(): string {
    const user = this.authStateService.getUser();
    return user?.name || user?.email || 'Admin';
  }

  get userRoles(): string[] {
    return this.tokenService.getRoles();
  }

  get isAdmin(): boolean {
    return this.tokenService.hasRole(APP_CONSTANTS.ROLES.ADMIN);
  }

  get isOperator(): boolean {
    return this.tokenService.hasRole(APP_CONSTANTS.ROLES.BUS_OPERATOR);
  }

  get currentNavItems(): AdminNavItem[] {
    if (this.isAdmin) {
      return this.navItems;
    }
    if (this.isOperator) {
      return this.operatorNavItems;
    }
    return [];
  }

  get panelTitle(): string {
    if (this.isAdmin) return 'Admin Panel';
    if (this.isOperator) return 'Operator Panel';
    return 'Dashboard';
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authStateService.logout();
    this.router.navigate(['/']);
  }
}
