import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operator-dashboard',
  standalone:false,
  templateUrl: './operator-dashboard.component.html',
  styleUrl: './operator-dashboard.component.css',
})
export class OperatorDashboardComponent implements OnInit {


  activeTab: 'DASHBOARD' | 'FLEET' | 'TRIPS' = 'DASHBOARD';
  operatorName: string = 'SRS Travels';

  // Mock KPIs
  kpis = {
    todayRevenue: 45000,
    activeBuses: 12,
    totalBuses: 15,
    avgOccupancy: 78 // percentage
  };

  // Mock Active Trips with AI Demand Predictions
  activeTrips = [
    { 
      id: 'TRP-101', 
      route: 'Bangalore → Chennai', 
      time: '10:30 PM', 
      busType: 'AC Sleeper', 
      bookedSeats: 32, 
      totalSeats: 40,
      aiDemand: 'HIGH', // Prediction for dynamic pricing
      status: 'ON_TIME'
    },
    { 
      id: 'TRP-102', 
      route: 'Hyderabad → Bangalore', 
      time: '09:00 PM', 
      busType: 'Non-AC Seater', 
      bookedSeats: 15, 
      totalSeats: 45,
      aiDemand: 'LOW',
      status: 'DELAYED'
    },
    { 
      id: 'TRP-103', 
      route: 'Chennai → Madurai', 
      time: '11:15 PM', 
      busType: 'AC Sleeper', 
      bookedSeats: 25, 
      totalSeats: 30,
      aiDemand: 'MEDIUM',
      status: 'ON_TIME'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  setTab(tab: 'DASHBOARD' | 'FLEET' | 'TRIPS'): void {
    this.activeTab = tab;
  }
}
