import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingStateService } from '../../../core/services/booking-state.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  
  totalAmount: number = 0;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' = 'CARD';
  paymentStatus: 'INITIATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' = 'INITIATED';
  errorMessage: string = '';

  // Mock form fields
  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';
  upiId: string = '';

  constructor(
    private router: Router,
    private bookingState: BookingStateService
  ) {}

  ngOnInit(): void {
    this.totalAmount = this.bookingState.getTotalAmount() || 1500; 
    
    if (this.totalAmount === 0) {
      this.router.navigate(['/']);
    }
  }

  setPaymentMethod(method: 'UPI' | 'CARD' | 'NET_BANKING'): void {
    this.paymentMethod = method;
  }

  processPayment(): void {
    this.paymentStatus = 'PROCESSING';
    this.errorMessage = '';

    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        this.paymentStatus = 'SUCCESS';
        this.completeBooking();
      } else {
        this.paymentStatus = 'FAILED';
        this.errorMessage = 'Payment failed due to bank server timeout. Please try again.';
      }
    }, 2500);
  }

  completeBooking(): void {
    setTimeout(() => {
      this.router.navigate(['/ticket']);
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/booking-confirmation']);
  }
}
