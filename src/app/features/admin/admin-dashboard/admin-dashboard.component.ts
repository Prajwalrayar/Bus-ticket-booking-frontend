import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone:false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {


  activeTab: 'OVERVIEW' | 'ROUTES' | 'OPERATORS' | 'REPORTS' = 'OVERVIEW';

  // Mock KPIs
  kpis = {
    totalRevenue: 4525000,
    totalBookings: 3420,
    activeOperators: 45,
    occupancyRate: 82 // percentage
  };

  // Mock Recent Bookings
  recentBookings = [
    { id: 'BKG-9921', user: 'John Doe', route: 'Bangalore → Chennai', amount: 1500, status: 'CONFIRMED', date: '2026-08-29' },
    { id: 'BKG-9922', user: 'Alice Smith', route: 'Mumbai → Pune', amount: 800, status: 'PENDING', date: '2026-08-29' },
    { id: 'BKG-9923', user: 'Rahul K', route: 'Hyderabad → Bangalore', amount: 1200, status: 'CANCELLED', date: '2026-08-28' },
    { id: 'BKG-9924', user: 'Priya M', route: 'Delhi → Jaipur', amount: 950, status: 'CONFIRMED', date: '2026-08-28' }
  ];

  constructor() {}

  ngOnInit(): void {}

  setTab(tab: 'OVERVIEW' | 'ROUTES' | 'OPERATORS' | 'REPORTS'): void {
    this.activeTab = tab;
  }
}
