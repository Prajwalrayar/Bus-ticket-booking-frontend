import { Component } from '@angular/core';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuditLogDTO } from '../../../core/models/audit-log';

@Component({
  selector: 'app-audit-logs',
  standalone: false,
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {
  activeTab: 'action' | 'entity' = 'action';
  
  // Action Search
  searchAction = '';
  
  // Entity Search
  searchEntityName = '';
  searchEntityReference = '';

  auditLogs: AuditLogDTO[] = [];
  isLoading = false;
  hasSearched = false;
  errorMessage = '';

  constructor(private auditLogService: AuditLogService) {}

  setTab(tab: 'action' | 'entity'): void {
    this.activeTab = tab;
    this.resetSearch();
  }

  resetSearch(): void {
    this.auditLogs = [];
    this.hasSearched = false;
    this.errorMessage = '';
    this.searchAction = '';
    this.searchEntityName = '';
    this.searchEntityReference = '';
  }

  searchByAction(): void {
    if (!this.searchAction.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    this.auditLogService.getAuditLogsByAction(this.searchAction.trim()).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to search audit logs by action.';
        this.isLoading = false;
      }
    });
  }

  searchByEntity(): void {
    if (!this.searchEntityName.trim() || !this.searchEntityReference.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.auditLogService.getAuditLogsByEntity(this.searchEntityName.trim(), this.searchEntityReference.trim()).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.hasSearched = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to search audit logs by entity.';
        this.isLoading = false;
      }
    });
  }
}
