import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { AdminDashboardDTO } from '../../../core/models/admin-dashboard';
import { UserService } from '../../../core/services/user.service';
import { UserDTO, StaffCreateRequest } from '../../../core/models/user';

@Component({
  selector: 'app-admin-dashboard',
  standalone:false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {

  activeTab: 'OVERVIEW' | 'ROUTES' | 'OPERATORS' | 'REPORTS' = 'OVERVIEW';

  dashboardData: AdminDashboardDTO | null = null;
  loading: boolean = true;
  error: string = '';

  users: UserDTO[] = [];
  usersLoading: boolean = false;
  usersError: string = '';

  showStaffModal: boolean = false;
  staffForm: StaffCreateRequest = {
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    roleName: 'BUS_OPERATOR'
  };
  staffSubmitSuccess: string = '';
  staffSubmitError: string = '';

  constructor(
    private adminService: AdminService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getDashboardKPIs().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load admin dashboard data', err);
        this.error = 'Failed to load dashboard metrics. Please try again.';
        this.loading = false;
      }
    });
  }

  fetchAllUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.usersLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.usersError = 'Failed to load users list.';
        this.usersLoading = false;
      }
    });
  }

  openStaffModal(): void {
    this.staffSubmitSuccess = '';
    this.staffSubmitError = '';
    this.staffForm = { fullName: '', email: '', mobileNumber: '', password: '', roleName: 'BUS_OPERATOR' };
    this.showStaffModal = true;
  }

  closeStaffModal(): void {
    this.showStaffModal = false;
  }

  createStaff(): void {
    this.staffSubmitError = '';
    this.staffSubmitSuccess = '';
    this.adminService.createStaff(this.staffForm).subscribe({
      next: (res) => {
        this.staffSubmitSuccess = 'Staff member created successfully.';
        this.fetchAllUsers();
        setTimeout(() => this.closeStaffModal(), 1500);
      },
      error: (err) => {
        console.error('Error creating staff', err);
        this.staffSubmitError = err.error?.message || 'Failed to create staff member.';
      }
    });
  }

  setTab(tab: 'OVERVIEW' | 'ROUTES' | 'OPERATORS' | 'REPORTS'): void {
    this.activeTab = tab;
    if (tab === 'OPERATORS') {
      this.fetchAllUsers();
    }
  }
}

