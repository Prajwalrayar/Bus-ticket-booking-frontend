import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { AdminDashboardDTO } from '../../../core/models/admin-dashboard';
import { UserService } from '../../../core/services/user.service';
import { UserDTO, StaffCreateRequest } from '../../../core/models/user';
import { BusService } from '../../../core/services/bus.service';
import { BusDTO, BusCreateRequest, BusSeatDTO, BusSeatCreateRequest } from '../../../core/models/bus';
import { RouteService } from '../../../core/services/route.service';
import { RouteDTO, RouteCreateRequest, RouteStopDTO, RouteStopCreateRequest } from '../../../core/models/route';
import { TripService } from '../../../core/services/trip.service';
import { TripDTO, TripCreateRequest } from '../../../core/models/trip';
@Component({
  selector: 'app-admin-dashboard',
  standalone:false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {

  activeTab: 'OVERVIEW' | 'ROUTES' | 'OPERATORS' | 'REPORTS' | 'ROUTES_MGT' | 'TRIPS' = 'OVERVIEW';

  dashboardData: AdminDashboardDTO | null = null;
  loading: boolean = true;
  error: string = '';

  users: UserDTO[] = [];
  usersLoading: boolean = false;
  usersError: string = '';

  showStaffModal: boolean = false;
  staffForm: StaffCreateRequest = {
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    roleName: 'BUS_OPERATOR'
  };
  staffSubmitSuccess: string = '';
  staffSubmitError: string = '';

  // BUS MANAGEMENT
  buses: BusDTO[] = [];
  busesLoading: boolean = false;
  busesError: string = '';

  showBusModal: boolean = false;
  busForm: BusCreateRequest = {
    registrationNumber: '',
    busType: 'SEATER',
    amenities: [],
    operatorCompanyName: ''
  };
  busAmenitiesStr: string = ''; // to handle comma-separated
  busSubmitSuccess: string = '';
  busSubmitError: string = '';
  isEditingBus: boolean = false;

  // SEAT MANAGEMENT
  selectedBus: BusDTO | null = null;
  seats: BusSeatDTO[] = [];
  seatsLoading: boolean = false;
  seatsError: string = '';
  showSeatModal: boolean = false;
  seatForm: BusSeatCreateRequest = {
    seatNumber: '',
    seatPosition: 'LOWER'
  };
  seatSubmitSuccess: string = '';
  seatSubmitError: string = '';

  // ROUTE MANAGEMENT
  routes: RouteDTO[] = [];
  routesLoading: boolean = false;
  routesError: string = '';
  
  showRouteModal: boolean = false;
  routeForm: RouteCreateRequest = {
    source: '',
    destination: '',
    distance: 0
  };
  isEditingRoute: boolean = false;
  routeSubmitSuccess: string = '';
  routeSubmitError: string = '';

  // ROUTE STOP MANAGEMENT
  selectedRoute: RouteDTO | null = null;
  routeStops: RouteStopDTO[] = [];
  stopsLoading: boolean = false;
  stopsError: string = '';

  showStopModal: boolean = false;
  stopForm: RouteStopCreateRequest = {
    stopName: '',
    stopSequence: 1,
    stopType: 'BOARDING',
    distanceFromSourceKm: 0
  };
  isEditingStop: boolean = false;
  stopSubmitSuccess: string = '';
  stopSubmitError: string = '';
  
  // TO STORE ORIGINAL SOURCE/DESTINATION AND STOP NAME FOR UPDATE CALLS
  originalRouteSource: string = '';
  originalRouteDestination: string = '';
  originalStopName: string = '';

  // TRIP MANAGEMENT
  trips: TripDTO[] = [];
  tripsLoading: boolean = false;
  tripsError: string = '';

  showTripModal: boolean = false;
  tripForm: TripCreateRequest = {
    busRegistrationNumber: '',
    source: '',
    destination: '',
    travelDate: '',
    departureTime: '',
    arrivalTime: '',
    baseFare: 0
  };
  isEditingTrip: boolean = false;
  tripSubmitSuccess: string = '';
  tripSubmitError: string = '';

  // Original Trip Details for updating
  originalTripBusReg: string = '';
  originalTripSource: string = '';
  originalTripDestination: string = '';
  originalTripTravelDate: string = '';

  // Options for dropdowns
  availableBuses: BusDTO[] = [];
  availableRoutes: RouteDTO[] = [];

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private busService: BusService,
    private routeService: RouteService,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getDashboardKPIs().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load admin dashboard data', err);
        this.error = 'Failed to load dashboard metrics. Please try again.';
        this.loading = false;
      }
    });
  }

  fetchAllUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.usersLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.usersError = 'Failed to load users list.';
        this.usersLoading = false;
      }
    });
  }

  openStaffModal(): void {
    this.staffSubmitSuccess = '';
    this.staffSubmitError = '';
    this.staffForm = { fullName: '', email: '', mobileNumber: '', password: '', roleName: 'BUS_OPERATOR' };
    this.showStaffModal = true;
  }

  closeStaffModal(): void {
    this.showStaffModal = false;
  }

  createStaff(): void {
    this.staffSubmitError = '';
    this.staffSubmitSuccess = '';
    this.adminService.createStaff(this.staffForm).subscribe({
      next: (res) => {
        this.staffSubmitSuccess = 'Staff member created successfully.';
        this.fetchAllUsers();
        setTimeout(() => this.closeStaffModal(), 1500);
      },
      error: (err) => {
        console.error('Error creating staff', err);
        this.staffSubmitError = err.error?.message || 'Failed to create staff member.';
      }
    });
  }

  setTab(tab: 'OVERVIEW' | 'ROUTES' | 'OPERATORS' | 'REPORTS' | 'ROUTES_MGT' | 'TRIPS'): void {
    this.activeTab = tab as any;
    if (tab === 'OPERATORS') {
      this.fetchAllUsers();
    }
    if (tab === 'ROUTES') { // Fleet Management
      this.fetchAllBuses();
      this.selectedBus = null;
    }
    if (tab === 'ROUTES_MGT') { // Route Management
      this.fetchAllRoutes();
      this.selectedRoute = null;
    }
    if (tab === 'TRIPS') {
      this.fetchAllTrips();
    }
  }

  // =========================================================
  // ROUTE MANAGEMENT
  // =========================================================

  fetchAllRoutes(): void {
    this.routesLoading = true;
    this.routesError = '';
    this.routeService.getAllRoutes().subscribe({
      next: (data) => {
        this.routes = data;
        this.routesLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch routes', err);
        this.routesError = 'Failed to load routes data.';
        this.routesLoading = false;
      }
    });
  }

  openRouteModal(route?: RouteDTO): void {
    this.routeSubmitSuccess = '';
    this.routeSubmitError = '';
    if (route) {
      this.isEditingRoute = true;
      this.originalRouteSource = route.source;
      this.originalRouteDestination = route.destination;
      this.routeForm = {
        source: route.source,
        destination: route.destination,
        distance: route.distance
      };
    } else {
      this.isEditingRoute = false;
      this.routeForm = {
        source: '',
        destination: '',
        distance: 0
      };
    }
    this.showRouteModal = true;
  }

  closeRouteModal(): void {
    this.showRouteModal = false;
  }

  saveRoute(): void {
    this.routeSubmitError = '';
    this.routeSubmitSuccess = '';

    if (this.isEditingRoute) {
      this.routeService.updateRoute(this.originalRouteSource, this.originalRouteDestination, this.routeForm).subscribe({
        next: (res) => {
          this.routeSubmitSuccess = 'Route updated successfully.';
          this.fetchAllRoutes();
          setTimeout(() => this.closeRouteModal(), 1500);
        },
        error: (err) => {
          console.error('Error updating route', err);
          this.routeSubmitError = err.error?.message || 'Failed to update route.';
        }
      });
    } else {
      this.routeService.createRoute(this.routeForm).subscribe({
        next: (res) => {
          this.routeSubmitSuccess = 'Route created successfully.';
          this.fetchAllRoutes();
          setTimeout(() => this.closeRouteModal(), 1500);
        },
        error: (err) => {
          console.error('Error creating route', err);
          this.routeSubmitError = err.error?.message || 'Failed to create route.';
        }
      });
    }
  }

  deactivateRoute(source: string, destination: string): void {
    if (confirm(`Are you sure you want to deactivate route from ${source} to ${destination}?`)) {
      this.routeService.deactivateRoute(source, destination).subscribe({
        next: () => this.fetchAllRoutes(),
        error: (err) => console.error('Error deactivating route', err)
      });
    }
  }

  // =========================================================
  // ROUTE STOP MANAGEMENT
  // =========================================================

  viewRouteStops(route: RouteDTO): void {
    this.selectedRoute = route;
    this.fetchRouteStops();
  }

  closeRouteStopsView(): void {
    this.selectedRoute = null;
  }

  fetchRouteStops(): void {
    if (!this.selectedRoute) return;
    this.stopsLoading = true;
    this.stopsError = '';
    this.routeService.getRouteStops(this.selectedRoute.source, this.selectedRoute.destination).subscribe({
      next: (data) => {
        // Sort by sequence to ensure correct visual order
        this.routeStops = data.sort((a, b) => a.stopSequence - b.stopSequence);
        this.stopsLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch route stops', err);
        this.stopsError = 'Failed to load route stops.';
        this.stopsLoading = false;
      }
    });
  }

  openStopModal(stop?: RouteStopDTO): void {
    this.stopSubmitSuccess = '';
    this.stopSubmitError = '';
    if (stop) {
      this.isEditingStop = true;
      this.originalStopName = stop.stopName;
      this.stopForm = {
        stopName: stop.stopName,
        stopSequence: stop.stopSequence,
        stopType: stop.stopType,
        distanceFromSourceKm: stop.distanceFromSourceKm
      };
    } else {
      this.isEditingStop = false;
      this.stopForm = {
        stopName: '',
        stopSequence: this.routeStops.length + 1,
        stopType: 'INTERMEDIATE',
        distanceFromSourceKm: 0
      };
    }
    this.showStopModal = true;
  }

  closeStopModal(): void {
    this.showStopModal = false;
  }

  saveStop(): void {
    if (!this.selectedRoute) return;
    this.stopSubmitError = '';
    this.stopSubmitSuccess = '';

    if (this.isEditingStop) {
      this.routeService.updateRouteStop(
        this.selectedRoute.source, 
        this.selectedRoute.destination, 
        this.originalStopName, 
        this.stopForm
      ).subscribe({
        next: (res) => {
          this.stopSubmitSuccess = 'Stop updated successfully.';
          this.fetchRouteStops();
          setTimeout(() => this.closeStopModal(), 1500);
        },
        error: (err) => {
          console.error('Error updating stop', err);
          this.stopSubmitError = err.error?.message || 'Failed to update stop.';
        }
      });
    } else {
      this.routeService.createRouteStop(
        this.selectedRoute.source, 
        this.selectedRoute.destination, 
        this.stopForm
      ).subscribe({
        next: (res) => {
          this.stopSubmitSuccess = 'Stop added successfully.';
          this.fetchRouteStops();
          setTimeout(() => this.closeStopModal(), 1500);
        },
        error: (err) => {
          console.error('Error creating stop', err);
          this.stopSubmitError = err.error?.message || 'Failed to add stop.';
        }
      });
    }
  }

  // =========================================================
  // BUS MANAGEMENT
  // =========================================================

  fetchAllBuses(): void {
    this.busesLoading = true;
    this.busesError = '';
    this.busService.getAllBuses().subscribe({
      next: (data) => {
        this.buses = data;
        this.busesLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch buses', err);
        this.busesError = 'Failed to load fleet data.';
        this.busesLoading = false;
      }
    });
  }

  openBusModal(bus?: BusDTO): void {
    this.busSubmitSuccess = '';
    this.busSubmitError = '';
    if (bus) {
      this.isEditingBus = true;
      this.busForm = {
        registrationNumber: bus.registrationNumber,
        busType: bus.busType,
        operatorCompanyName: bus.operatorCompanyName,
        amenities: [...bus.amenities]
      };
      this.busAmenitiesStr = bus.amenities.join(', ');
    } else {
      this.isEditingBus = false;
      this.busForm = {
        registrationNumber: '',
        busType: 'SEATER',
        operatorCompanyName: '',
        amenities: []
      };
      this.busAmenitiesStr = '';
    }
    this.showBusModal = true;
  }

  closeBusModal(): void {
    this.showBusModal = false;
  }

  saveBus(): void {
    this.busSubmitError = '';
    this.busSubmitSuccess = '';
    
    // Parse amenities
    this.busForm.amenities = this.busAmenitiesStr.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (this.isEditingBus) {
      this.busService.updateBus(this.busForm.registrationNumber, this.busForm).subscribe({
        next: (res) => {
          this.busSubmitSuccess = 'Bus updated successfully.';
          this.fetchAllBuses();
          setTimeout(() => this.closeBusModal(), 1500);
        },
        error: (err) => {
          console.error('Error updating bus', err);
          this.busSubmitError = err.error?.message || 'Failed to update bus.';
        }
      });
    } else {
      this.busService.createBus(this.busForm).subscribe({
        next: (res) => {
          this.busSubmitSuccess = 'Bus created successfully.';
          this.fetchAllBuses();
          setTimeout(() => this.closeBusModal(), 1500);
        },
        error: (err) => {
          console.error('Error creating bus', err);
          this.busSubmitError = err.error?.message || 'Failed to create bus.';
        }
      });
    }
  }

  deactivateBus(registrationNumber: string): void {
    if (confirm('Are you sure you want to deactivate this bus?')) {
      this.busService.deactivateBus(registrationNumber).subscribe({
        next: () => this.fetchAllBuses(),
        error: (err) => console.error('Error deactivating bus', err)
      });
    }
  }

  // =========================================================
  // SEAT MANAGEMENT
  // =========================================================

  viewBusSeats(bus: BusDTO): void {
    this.selectedBus = bus;
    this.fetchSeats();
  }

  closeSeatsView(): void {
    this.selectedBus = null;
  }

  fetchSeats(): void {
    if (!this.selectedBus) return;
    this.seatsLoading = true;
    this.seatsError = '';
    this.busService.getSeatsByBus(this.selectedBus.registrationNumber).subscribe({
      next: (data) => {
        this.seats = data;
        this.seatsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load seats', err);
        this.seatsError = 'Failed to load seats data.';
        this.seatsLoading = false;
      }
    });
  }

  openSeatModal(): void {
    this.seatSubmitSuccess = '';
    this.seatSubmitError = '';
    this.seatForm = { seatNumber: '', seatPosition: 'LOWER' };
    this.showSeatModal = true;
  }

  closeSeatModal(): void {
    this.showSeatModal = false;
  }

  saveSeat(): void {
    if (!this.selectedBus) return;
    this.seatSubmitError = '';
    this.seatSubmitSuccess = '';

    this.busService.createBusSeat(this.selectedBus.registrationNumber, this.seatForm).subscribe({
      next: (res) => {
        this.seatSubmitSuccess = 'Seat added successfully.';
        this.fetchSeats();
        setTimeout(() => this.closeSeatModal(), 1500);
      },
      error: (err) => {
        console.error('Error creating seat', err);
        this.seatSubmitError = err.error?.message || 'Failed to add seat.';
      }
    });
  }

  deactivateSeat(seatNumber: string): void {
    if (!this.selectedBus) return;
    if (confirm(`Are you sure you want to deactivate seat ${seatNumber}?`)) {
      this.busService.deactivateBusSeat(this.selectedBus.registrationNumber, seatNumber).subscribe({
        next: () => this.fetchSeats(),
        error: (err) => console.error('Error deactivating seat', err)
      });
    }
  }

  // =========================================================
  // TRIP MANAGEMENT
  // =========================================================

  fetchAllTrips(): void {
    this.tripsLoading = true;
    this.tripsError = '';
    this.tripService.getAllTrips().subscribe({
      next: (data) => {
        this.trips = data;
        this.tripsLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch trips', err);
        this.tripsError = 'Failed to load trips data.';
        this.tripsLoading = false;
      }
    });
  }

  openTripModal(trip?: TripDTO): void {
    this.tripSubmitSuccess = '';
    this.tripSubmitError = '';
    
    // Load options for dropdowns
    this.busService.getAllBuses().subscribe(res => this.availableBuses = res);
    this.routeService.getAllRoutes().subscribe(res => this.availableRoutes = res);

    if (trip) {
      this.isEditingTrip = true;
      this.originalTripBusReg = trip.busRegistrationNumber;
      this.originalTripSource = trip.source;
      this.originalTripDestination = trip.destination;
      this.originalTripTravelDate = trip.travelDate;
      this.tripForm = {
        busRegistrationNumber: trip.busRegistrationNumber,
        source: trip.source,
        destination: trip.destination,
        travelDate: trip.travelDate,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        baseFare: trip.baseFare
      };
    } else {
      this.isEditingTrip = false;
      this.tripForm = {
        busRegistrationNumber: '',
        source: '',
        destination: '',
        travelDate: '',
        departureTime: '',
        arrivalTime: '',
        baseFare: 0
      };
    }
    this.showTripModal = true;
  }

  closeTripModal(): void {
    this.showTripModal = false;
  }

  saveTrip(): void {
    this.tripSubmitError = '';
    this.tripSubmitSuccess = '';

    // Append seconds to time if not present
    if (this.tripForm.departureTime && this.tripForm.departureTime.length === 5) {
      this.tripForm.departureTime += ':00';
    }
    if (this.tripForm.arrivalTime && this.tripForm.arrivalTime.length === 5) {
      this.tripForm.arrivalTime += ':00';
    }

    if (this.isEditingTrip) {
      this.tripService.updateTrip(
        this.originalTripBusReg,
        this.originalTripSource,
        this.originalTripDestination,
        this.originalTripTravelDate,
        this.tripForm
      ).subscribe({
        next: (res) => {
          this.tripSubmitSuccess = 'Trip updated successfully.';
          this.fetchAllTrips();
          setTimeout(() => this.closeTripModal(), 1500);
        },
        error: (err) => {
          console.error('Error updating trip', err);
          this.tripSubmitError = err.error?.message || 'Failed to update trip.';
        }
      });
    } else {
      this.tripService.createTrip(this.tripForm).subscribe({
        next: (res) => {
          this.tripSubmitSuccess = 'Trip created successfully.';
          this.fetchAllTrips();
          setTimeout(() => this.closeTripModal(), 1500);
        },
        error: (err) => {
          console.error('Error creating trip', err);
          this.tripSubmitError = err.error?.message || 'Failed to create trip.';
        }
      });
    }
  }

  cancelTrip(trip: TripDTO): void {
    const reason = prompt('Please enter the cancellation reason:');
    if (reason && reason.trim() !== '') {
      this.tripService.cancelTrip(
        trip.busRegistrationNumber,
        trip.source,
        trip.destination,
        trip.travelDate,
        reason
      ).subscribe({
        next: () => this.fetchAllTrips(),
        error: (err) => alert(err.error?.message || 'Failed to cancel trip.')
      });
    }
  }

}

