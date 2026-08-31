import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  activeTab: 'BOOKINGS' | 'PASSENGERS' | 'SETTINGS' = 'BOOKINGS';

  // Mock Data
  activeBookings = [
    {
      id: 'BKG789012',
      from: 'Bangalore',
      to: 'Chennai',
      date: '2026-09-05',
      time: '10:30 PM',
      status: 'CONFIRMED',
      operator: 'SRS Travels',
      seats: ['U4', 'U5'],
      fare: 1500
    }
  ];

  pastBookings = [
    {
      id: 'BKG123456',
      from: 'Hyderabad',
      to: 'Bangalore',
      date: '2026-08-10',
      time: '09:00 PM',
      status: 'COMPLETED',
      operator: 'VRL Logistics',
      seats: ['L1'],
      fare: 1200
    }
  ];

  savedPassengers = [
    { name: 'John Doe', age: 30, gender: 'MALE' },
    { name: 'Jane Doe', age: 28, gender: 'FEMALE' }
  ];

  constructor() {}

  ngOnInit(): void {}

  setTab(tab: 'BOOKINGS' | 'PASSENGERS' | 'SETTINGS'): void {
    this.activeTab = tab;
  }

  cancelBooking(id: string): void {
    const confirmCancel = confirm(`Are you sure you want to cancel booking ${id}?`);
    if (confirmCancel) {
      alert(`Booking ${id} has been cancelled successfully.`);
      // In reality, this would call bookingService.cancelBooking(id)
      this.activeBookings = this.activeBookings.filter(b => b.id !== id);
    }
  }

  deletePassenger(index: number): void {
    this.savedPassengers.splice(index, 1);
  }
}
