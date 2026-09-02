import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { UserDTO, UserUpdateRequest } from '../../../core/models/user';
import { Booking } from '../../../core/models/booking';

@Component({
  selector: 'app-support-dashboard',
  standalone: false,
  templateUrl: './support-dashboard.html',
  styleUrl: './support-dashboard.css',
})
export class SupportDashboard implements OnInit {
  activeTab: 'profile' | 'bookings' = 'profile';
  
  userProfile: UserDTO | null = null;
  profileForm: UserUpdateRequest = {
    userName: '',
    mobileNumber: ''
  };
  profileUpdateSuccess = '';
  profileUpdateError = '';

  myBookings: Booking[] = [];
  bookingsError = '';

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadMyBookings();
  }

  setTab(tab: 'profile' | 'bookings'): void {
    this.activeTab = tab;
  }

  loadProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (profile: UserDTO) => {
        this.userProfile = profile;
        this.profileForm = {
          userName: profile.userName,
          mobileNumber: profile.mobileNumber || ''
        };
      },
      error: (err: any) => console.error('Error loading profile', err)
    });
  }

  updateProfile(): void {
    this.profileUpdateSuccess = '';
    this.profileUpdateError = '';
    
    this.userService.updateMyProfile(this.profileForm).subscribe({
      next: (updated: UserDTO) => {
        this.userProfile = updated;
        this.profileUpdateSuccess = 'Profile updated successfully.';
        this.authState.setUser({
          userId: updated.userId,
          name: updated.userName,
          email: updated.userEmail,
          roles: updated.roleNames
        });
      },
      error: (err: any) => {
        this.profileUpdateError = err.error?.message || 'Failed to update profile';
      }
    });
  }

  loadMyBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (bookings: Booking[]) => this.myBookings = bookings,
      error: (err: any) => this.bookingsError = err.error?.message || 'Failed to load bookings'
    });
  }
}
