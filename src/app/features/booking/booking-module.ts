import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BookingConfirmationComponent],
  imports: [CommonModule,RouterLink,FormsModule],
})
export class BookingModule {}
