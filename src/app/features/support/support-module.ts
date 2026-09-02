import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupportDashboard } from './support-dashboard/support-dashboard';

@NgModule({
  declarations: [SupportDashboard],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [SupportDashboard]
})
export class SupportModule {}
