import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { HomeComponent } from './features/home/home.component';
import { BusSearchComponent } from './features/bus-search/bus-search.component';
import { SeatSelectionComponent } from './features/seat-selection/seat-selection/seat-selection.component';
import { PassengerDetailsComponent } from './features/passenger-details/passenger-details.component';
import { BookingConfirmationComponent } from './features/booking/booking-confirmation/booking-confirmation.component';
import { BookingSuccess } from './features/booking/booking-success/booking-success';
import { PaymentComponent } from './features/payment/payment/payment.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GuestGuard } from './core/guards/guest-guard';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
import { APP_CONSTANTS } from './core/constants/app-constants';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'search',
        component: BusSearchComponent,
      },
      {
        path: 'seat-selection',
        component: SeatSelectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'passenger-details',
        component: PassengerDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'booking-confirmation',
        component: BookingConfirmationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'booking-success',
        component: BookingSuccess,
        canActivate: [AuthGuard],
      },
      {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: [APP_CONSTANTS.ROLES.ADMIN, APP_CONSTANTS.ROLES.BUS_OPERATOR] },
    children: [
      // Placeholder for admin/operator modules to be added later
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
