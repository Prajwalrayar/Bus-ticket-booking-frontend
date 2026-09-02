import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuditLogs } from './audit-logs/audit-logs';

@NgModule({
  declarations: [AdminDashboardComponent, AuditLogs],
  imports: [SharedModule],
  exports: [AdminDashboardComponent],
})
export class AdminModule {}
