import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { PassengerDetailsModule } from '../passenger-details/passenger-details-module';

@NgModule({
  declarations: [BookingConfirmationComponent],
  imports: [SharedModule, PassengerDetailsModule],
  exports: [BookingConfirmationComponent, PassengerDetailsModule],
})
export class BookingModule {}
