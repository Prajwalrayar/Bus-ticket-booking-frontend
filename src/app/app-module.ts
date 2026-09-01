import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { App } from './app';
import { HomeSearch } from './features/home-search/home-search';
import { SeatLayout } from './features/seat-layout/seat-layout';
import { TicketConfirmation } from './features/ticket-confirmation/ticket-confirmation';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';


@NgModule({
  declarations: [App],

  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
