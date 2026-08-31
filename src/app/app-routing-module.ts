import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSearchComponent } from './features/home-search/home-search';
import { BusSearchComponent } from './features/bus-search/bus-search.component';
import { SeatSelectionComponent } from './features/seat-selection/seat-selection/seat-selection.component';
import { PassengerDetailsComponent } from './features/passenger-details/passenger-details.component';
import { BookingConfirmationComponent } from './features/booking/booking-confirmation/booking-confirmation.component';
import { PaymentComponent } from './features/payment/payment/payment.component';
import { TicketComponent } from './features/ticket/ticket/ticket.component';
import { ProfileComponent } from './features/profile/profile/profile.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { OperatorDashboardComponent } from './features/operator/operator-dashboard/operator-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

const routes: Routes = [
  { path: '', component: HomeSearchComponent, pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  { path: 'bus-search', component: BusSearchComponent },

  { path: 'seat-selection', component: SeatSelectionComponent, canActivate: [AuthGuard] },
  { path: 'passenger-details', component: PassengerDetailsComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'booking-confirmation', component: BookingConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'ticket', component: TicketComponent, canActivate: [AuthGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { expectedRoles: ['ROLE_ADMIN'] },
    children: [
      { path: '', component: AdminDashboardComponent, pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
    ],
  },

  {
    path: 'operator',
    canActivate: [RoleGuard],
    data: { expectedRoles: ['ROLE_BUS_OPERATOR', 'ROLE_ADMIN'] },
    children: [
      { path: '', component: OperatorDashboardComponent, pathMatch: 'full' },
      { path: 'dashboard', component: OperatorDashboardComponent },
    ],
  },

  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
