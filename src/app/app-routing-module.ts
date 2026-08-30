import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { BusSearchComponent } from './features/bus-search/bus-search.component';
import { SeatSelectionComponent } from './features/seat-selection/seat-selection/seat-selection.component';
import { PassengerDetailsComponent } from './features/passenger-details/passenger-details.component';
import { BookingConfirmationComponent } from './features/booking/booking-confirmation/booking-confirmation.component';
import { PaymentComponent } from './features/payment/payment/payment.component';
import { TicketComponent } from './features/ticket/ticket/ticket.component';


const routes: Routes = [

  {path: '',component: HomeComponent},
  {path:'bus-search',component:BusSearchComponent},
  {path: 'login',component: LoginComponent},
  {path:'register', component:RegisterComponent},
  {path: 'seat-selection',component: SeatSelectionComponent},
  {path: 'passenger-details',component: PassengerDetailsComponent},
  {path: 'booking-confirmation',component: BookingConfirmationComponent},
  {path: 'payment',component: PaymentComponent},
  {path: 'ticket',component: TicketComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
