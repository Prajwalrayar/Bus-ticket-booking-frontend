import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Passenger } from '../../core/models/passenger';
import { BookingStateService } from '../../core/services/booking-state.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-passenger-details',
  standalone: false,
  templateUrl: './passenger-details.component.html',
  styleUrl: './passenger-details.component.css',
})
export class PassengerDetailsComponent implements OnInit {


  // ==========================================================
  // SEARCH INFORMATION
  // ==========================================================

  fromCity = signal('');

  toCity = signal('');

  journeyDate = signal('');


  // ==========================================================
  // BUS INFORMATION
  // ==========================================================

  busId = signal(0);

  busName = signal('');


  // ==========================================================
  // SELECTED SEATS
  // ==========================================================

  selectedSeatNumbers = signal<string[]>([]);


  // ==========================================================
  // PASSENGER DETAILS
  // ==========================================================

  passengers = signal<Passenger[]>([]);


  // ==========================================================
  // UI STATE
  // ==========================================================

  errorMessage = signal('');

  loading = signal(false);


  constructor(
    private route: ActivatedRoute,
    private router: Router, private bookingStateService: BookingStateService,
    private authStateService: AuthStateService
  ) { }


  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const busId = Number(params['busId']);

      const seatsParam = params['seats'] || '';

      this.busId.set(busId);

      this.fromCity.set(params['from'] || '');

      this.toCity.set(params['to'] || '');

      this.journeyDate.set(params['date'] || '');

      this.busName.set(params['busName'] || '');


      // ------------------------------------------------------
      // Validate bus
      // ------------------------------------------------------

      if (!busId) {

        this.errorMessage.set(
          'Bus information is missing.'
        );

        return;
      }


      // ------------------------------------------------------
      // Get selected seats
      // ------------------------------------------------------

      const seatNumbers = seatsParam
        .split(',')
        .filter((seat: string) => seat.trim() !== '');


      if (seatNumbers.length === 0) {

        this.errorMessage.set(
          'No seats have been selected.'
        );

        return;
      }


      this.selectedSeatNumbers.set(seatNumbers);


      // ------------------------------------------------------
      // Create passenger form for every selected seat
      // ------------------------------------------------------

      const savedPassengers =
        this.bookingStateService.getPassengers();
      const currentUser =
        this.authStateService.getUser();

      const passengerList: Passenger[] =
        seatNumbers.map((seatNumber: string) => {

          const savedPassenger =
            savedPassengers.find(
              passenger =>
                passenger.seatNumber === seatNumber
            );


          if (savedPassenger) {

            return savedPassenger;

          }


          return {

            seatNumber: seatNumber,

            name: currentUser?.name || '',

            age: null,

            gender: '',

            phone: currentUser?.phone || ''

          };

        });


      this.passengers.set(passengerList);

    });

  }


  // ==========================================================
  // UPDATE PASSENGER
  // ==========================================================

  updatePassenger(
    index: number,
    field: keyof Passenger,
    value: string | number | null
  ): void {

    this.passengers.update(passengers => {

      const updatedPassengers = [...passengers];

      updatedPassengers[index] = {
        ...updatedPassengers[index],
        [field]: value
      };

      return updatedPassengers;

    });

  }


  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  validatePassengers(): boolean {

    for (const passenger of this.passengers()) {

      if (!passenger.name.trim()) {

        this.errorMessage.set(
          `Please enter name for seat ${passenger.seatNumber}.`
        );

        return false;
      }


      if (
        passenger.age === null ||
        passenger.age < 1 ||
        passenger.age > 100
      ) {

        this.errorMessage.set(
          `Please enter a valid age for seat ${passenger.seatNumber}.`
        );

        return false;
      }


      if (!passenger.gender) {

        this.errorMessage.set(
          `Please select gender for seat ${passenger.seatNumber}.`
        );

        return false;
      }


      if (
        !passenger.phone.trim() ||
        !/^[6-9]\d{9}$/.test(passenger.phone)
      ) {

        this.errorMessage.set(
          `Please enter a valid phone number for seat ${passenger.seatNumber}.`
        );

        return false;
      }

    }


    return true;

  }


  // ==========================================================
  // CONTINUE
  // ==========================================================

  continueBooking(): void {

    this.errorMessage.set('');


    // ==========================================================
    // VALIDATE PASSENGERS
    // ==========================================================

    if (!this.validatePassengers()) {

      return;

    }


    // ==========================================================
    // SAVE PASSENGER DETAILS
    // ==========================================================

    this.bookingStateService.setPassengers(
      this.passengers()
    );


    // ==========================================================
    // GO TO BOOKING CONFIRMATION
    // ==========================================================

    this.router.navigate(
      ['/booking-confirmation'],
      {
        queryParams: {

          busId: this.busId(),

          from: this.fromCity(),

          to: this.toCity(),

          date: this.journeyDate(),

          seats: this.selectedSeatNumbers().join(',')

        }
      }
    );

  }


  // ==========================================================
  // BACK TO SEATS
  // ==========================================================

  goBack(): void {

    this.router.navigate(
      ['/seat-selection'],
      {
        queryParams: {
          busId: this.busId(),

          from: this.fromCity(),

          to: this.toCity(),

          date: this.journeyDate(),

          seats: this.selectedSeatNumbers().join(',')
        }
      }
    );

  }
}
