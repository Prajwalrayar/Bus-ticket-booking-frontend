import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Passenger } from '../../../core/models/passenger';
import { BookingStateService } from '../../../core/services/booking-state.service';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent implements OnInit {

  bookingId: string = '';
  passengers: Passenger[] = [];
  totalAmount: number = 0;
  currentDate: Date = new Date();

  constructor(
    private router: Router,
    private bookingState: BookingStateService
  ) {}

  ngOnInit(): void {
    this.passengers = this.bookingState.getPassengers();
    this.totalAmount = this.bookingState.getTotalAmount();

    // Generate a mock booking ID
    this.bookingId = 'BKG' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // Redirect to home if accessed directly without booking state
    if (!this.passengers || this.passengers.length === 0) {
      this.router.navigate(['/']);
    }
  }

  printTicket(): void {
    window.print();
  }

  goHome(): void {
    this.bookingState.clearAllBookingData();
    this.router.navigate(['/']);
  }
}
