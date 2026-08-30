import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { HomeModule } from './features/home/home-module';
import { AuthModule } from './auth/auth-module';
import { SeatSelectionModule } from './features/seat-selection/seat-selection-module';
import { PassengerDetailsComponent } from './features/passenger-details/passenger-details.component';
import { BookingModule } from './features/booking/booking-module';
import { PaymentModule } from './features/payment/payment-module';
import { TicketModule } from './features/ticket/ticket-module';
import { OperatorDashboardComponent } from './features/operator/operator-dashboard/operator-dashboard.component';

@NgModule({
  declarations: [App, PassengerDetailsComponent, OperatorDashboardComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    AuthModule,
    SeatSelectionModule,
    BookingModule,
    PaymentModule,
    TicketModule,
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
