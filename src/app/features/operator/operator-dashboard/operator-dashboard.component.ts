import { Component, OnInit } from '@angular/core';
import { OperatorService } from '../../../core/services/operator.service';
import { OperatorDTO } from '../../../core/models/operator';
import { BusService } from '../../../core/services/bus.service';
import { BusDTO, BusCreateRequest, BusSeatDTO, BusSeatCreateRequest } from '../../../core/models/bus';
import { TripService } from '../../../core/services/trip.service';
import { TripDTO, TripSearchRequest } from '../../../core/models/trip';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/api-response';

@Component({
  selector: 'app-operator-dashboard',
  standalone: false,
  templateUrl: './operator-dashboard.component.html',
  styleUrl: './operator-dashboard.component.css',
})
export class OperatorDashboardComponent implements OnInit {

  activeTab: 'SETUP' | 'PROFILE' | 'FLEET' | 'TICKETS' | 'TRIPS' = 'SETUP';
  
  companyNameInput: string = '';
  isSetupComplete: boolean = false;
  operatorProfile: OperatorDTO | null = null;
  profileError: string = '';

  // FLEET
  buses: BusDTO[] = [];
  busesLoading: boolean = false;
  
  showBusModal: boolean = false;
  isEditingBus: boolean = false;
  busForm: BusCreateRequest = {
    registrationNumber: '',
    busType: 'SEATER',
    operatorCompanyName: '',
    amenities: []
  };
  busAmenitiesStr: string = '';
  busSubmitSuccess: string = '';
  busSubmitError: string = '';

  // SEATS
  showSeatModal: boolean = false;
  selectedBusForSeats: BusDTO | null = null;
  busSeats: BusSeatDTO[] = [];
  seatsLoading: boolean = false;
  isEditingSeat: boolean = false;
  originalSeatNumber: string = '';
  seatForm: BusSeatCreateRequest = {
    seatNumber: '',
    seatPosition: 'WINDOW'
  };
  seatSubmitSuccess: string = '';
  seatSubmitError: string = '';

  // TICKETS
  ticketNumberToValidate: string = '';
  ticketValidationMsg: string = '';
  ticketValidationError: string = '';

  // TRIPS
  tripSearchForm: TripSearchRequest = {
    source: '',
    destination: ''
  };
  tripSearchResults: TripDTO[] = [];
  tripSearchLoading: boolean = false;

  constructor(
    private operatorService: OperatorService,
    private busService: BusService,
    private tripService: TripService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const savedCompany = localStorage.getItem('operatorCompany');
    if (savedCompany) {
      this.companyNameInput = savedCompany;
      this.setupCompany();
    }
  }

  setupCompany(): void {
    if (!this.companyNameInput) return;
    this.operatorService.getOperatorByCompanyName(this.companyNameInput).subscribe({
      next: (res) => {
        this.operatorProfile = res;
        this.isSetupComplete = true;
        localStorage.setItem('operatorCompany', this.companyNameInput);
        this.setTab('PROFILE');
      },
      error: (err) => {
        this.profileError = 'Operator not found or unauthorized.';
      }
    });
  }

  setTab(tab: 'SETUP' | 'PROFILE' | 'FLEET' | 'TICKETS' | 'TRIPS'): void {
    this.activeTab = tab;
    if (tab === 'FLEET') this.fetchBuses();
  }

  // PROFILE
  saveProfile(): void {
    if (!this.operatorProfile) return;
    this.operatorService.updateOperator(this.companyNameInput, this.operatorProfile).subscribe({
      next: (res) => {
        this.operatorProfile = res;
        alert('Profile updated successfully!');
      },
      error: (err) => alert('Failed to update profile.')
    });
  }

  // FLEET
  fetchBuses(): void {
    this.busesLoading = true;
    this.busService.getBusesByOperator(this.companyNameInput).subscribe(res => {
      this.buses = res;
      this.busesLoading = false;
    });
  }

  openBusModal(bus?: BusDTO): void {
    this.busSubmitError = '';
    this.busSubmitSuccess = '';
    this.busAmenitiesStr = '';
    if (bus) {
      this.isEditingBus = true;
      this.busForm = {
        registrationNumber: bus.registrationNumber,
        busType: bus.busType,
        operatorCompanyName: bus.operatorCompanyName,
        amenities: bus.amenities || []
      };
      if (bus.amenities) {
        this.busAmenitiesStr = bus.amenities.join(', ');
      }
    } else {
      this.isEditingBus = false;
      this.busForm = {
        registrationNumber: '',
        busType: 'SEATER',
        operatorCompanyName: this.companyNameInput,
        amenities: []
      };
    }
    this.showBusModal = true;
  }

  closeBusModal(): void {
    this.showBusModal = false;
  }

  saveBus(): void {
    this.busSubmitError = '';
    this.busSubmitSuccess = '';
    let amenities: string[] = [];
    if (this.busAmenitiesStr.trim() !== '') {
      amenities = this.busAmenitiesStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    const payload: BusCreateRequest = { ...this.busForm, amenities };

    if (this.isEditingBus) {
      this.busService.updateBus(payload.registrationNumber, payload).subscribe({
        next: () => {
          this.busSubmitSuccess = 'Bus updated!';
          this.fetchBuses();
          setTimeout(() => this.closeBusModal(), 1500);
        },
        error: (err) => this.busSubmitError = err.error?.message || 'Error updating bus.'
      });
    } else {
      this.busService.createBus(payload).subscribe({
        next: () => {
          this.busSubmitSuccess = 'Bus created!';
          this.fetchBuses();
          setTimeout(() => this.closeBusModal(), 1500);
        },
        error: (err) => this.busSubmitError = err.error?.message || 'Error creating bus.'
      });
    }
  }

  // SEATS
  manageSeats(bus: BusDTO): void {
    this.selectedBusForSeats = bus;
    this.fetchSeats(bus.registrationNumber);
  }

  fetchSeats(reg: string): void {
    this.seatsLoading = true;
    this.busService.getSeatsByBus(reg).subscribe(res => {
      this.busSeats = res;
      this.seatsLoading = false;
    });
  }

  backToBuses(): void {
    this.selectedBusForSeats = null;
  }

  openSeatModal(seat?: BusSeatDTO): void {
    this.seatSubmitError = '';
    this.seatSubmitSuccess = '';
    if (seat) {
      this.isEditingSeat = true;
      this.originalSeatNumber = seat.seatNumber;
      this.seatForm = {
        seatNumber: seat.seatNumber,
        seatPosition: seat.seatPosition || 'WINDOW'
      };
    } else {
      this.isEditingSeat = false;
      this.seatForm = {
        seatNumber: '',
        seatPosition: 'WINDOW'
      };
    }
    this.showSeatModal = true;
  }

  closeSeatModal(): void {
    this.showSeatModal = false;
  }

  saveSeat(): void {
    this.seatSubmitError = '';
    this.seatSubmitSuccess = '';
    if (!this.selectedBusForSeats) return;

    if (this.isEditingSeat) {
      this.busService.updateBusSeat(this.selectedBusForSeats.registrationNumber, this.originalSeatNumber, this.seatForm).subscribe({
        next: () => {
          this.seatSubmitSuccess = 'Seat updated!';
          this.fetchSeats(this.selectedBusForSeats!.registrationNumber);
          setTimeout(() => this.closeSeatModal(), 1000);
        },
        error: (err) => this.seatSubmitError = err.error?.message || 'Error updating seat'
      });
    } else {
      this.busService.createBusSeat(this.selectedBusForSeats.registrationNumber, this.seatForm).subscribe({
        next: () => {
          this.seatSubmitSuccess = 'Seat created!';
          this.fetchSeats(this.selectedBusForSeats!.registrationNumber);
          setTimeout(() => this.closeSeatModal(), 1000);
        },
        error: (err) => this.seatSubmitError = err.error?.message || 'Error creating seat'
      });
    }
  }

  // TICKETS
  validateTicket(): void {
    if (!this.ticketNumberToValidate) return;
    this.ticketValidationMsg = '';
    this.ticketValidationError = '';
    this.http.patch<ApiResponse<any>>(`/api/tickets/${this.ticketNumberToValidate}/validate`, {}).subscribe({
      next: (res) => {
        this.ticketValidationMsg = 'Ticket validated successfully! Passenger can board.';
      },
      error: (err) => {
        this.ticketValidationError = err.error?.message || 'Failed to validate ticket. It may be invalid, cancelled, or already boarded.';
      }
    });
  }

  // TRIPS
  searchTrips(): void {
    this.tripSearchLoading = true;
    this.tripService.searchTrips(this.tripSearchForm).subscribe(res => {
      this.tripSearchResults = res.data;
      this.tripSearchLoading = false;
    });
  }

  cancelTrip(trip: TripDTO): void {
    const reason = prompt('Cancellation reason:');
    if (reason) {
      this.tripService.cancelTrip(trip.busRegistrationNumber, trip.source, trip.destination, trip.travelDate, reason).subscribe({
        next: () => this.searchTrips(),
        error: (err) => alert(err.error?.message || 'Error')
      });
    }
  }
}
