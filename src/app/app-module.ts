import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { SharedModule } from './shared/shared-module';
import { HomeModule } from './features/home/home-module';
import { AuthModule } from './auth/auth-module';
import { SeatSelectionModule } from './features/seat-selection/seat-selection-module';
import { BookingModule } from './features/booking/booking-module';
import { PaymentModule } from './features/payment/payment-module';
import { TicketModule } from './features/ticket/ticket-module';
import { ProfileModule } from './features/profile/profile-module';
import { BusSearchModule } from './features/bus-search/bus-search-module';
import { AdminModule } from './features/admin/admin-module';
import { OperatorModule } from './features/operator/operator-module';
import { PassengerDetailsModule } from './features/passenger-details/passenger-details-module';
import { HomeSearch } from './features/home-search/home-search';
import { SeatLayout } from './features/seat-layout/seat-layout';
import { TicketConfirmation } from './features/ticket-confirmation/ticket-confirmation';

@NgModule({
  declarations: [App, HomeSearch, SeatLayout, TicketConfirmation],

  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AuthModule,
    SeatSelectionModule,
    BookingModule,
    PaymentModule,
    TicketModule,
    ProfileModule,
    BusSearchModule,
    AdminModule,
    OperatorModule,
    PassengerDetailsModule
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
