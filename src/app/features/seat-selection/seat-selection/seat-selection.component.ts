import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bus } from '../../../core/models/bus';
import { Seat } from '../../../core/models/seat';
import { BusService } from '../../../core/services/bus.service';

@Component({
  selector: 'app-seat-selection',
  standalone: false,
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css',
})
export class SeatSelectionComponent {
  bus = signal<Bus | null>(null);

  seats = signal<Seat[]>([]);

  selectedSeats = signal<Seat[]>([]);

  loading = signal(false);

  errorMessage = signal('');
  fromCity = signal('');
  toCity = signal('');
  journeyDate = signal('');


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService
  ) { }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const busId = Number(params['busId']);

      this.fromCity.set(params['from'] || '');
      this.toCity.set(params['to'] || '');
      this.journeyDate.set(params['date'] || '');

      if (!busId) {

        this.errorMessage.set(
          'Bus information is missing.'
        );

        return;
      }

      this.loadBus(busId);

      this.loadSeats(busId);

    });

  }


  loadBus(busId: number): void {

    this.loading.set(true);

    this.busService
      .getBusById(busId)
      .subscribe({

        next: (bus) => {

          this.bus.set(bus);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Unable to load bus:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'Unable to load bus details.'
          );

        }

      });

  }


  loadSeats(busId: number): void {

    this.busService
      .getSeatsByBusId(busId)
      .subscribe({

        next: (seats) => {

          this.seats.set(seats);

        },

        error: (error) => {

          console.error(
            'Unable to load seats:',
            error
          );

          this.errorMessage.set(
            'Unable to load seats.'
          );

        }

      });

  }


  selectSeat(seat: Seat): void {

    if (seat.status === 'OCCUPIED') {

      return;

    }


    const alreadySelected =
      this.selectedSeats().some(
        selectedSeat =>
          selectedSeat.id === seat.id
      );


    if (alreadySelected) {

      this.selectedSeats.update(seats =>
        seats.filter(
          selectedSeat =>
            selectedSeat.id !== seat.id
        )
      );

      return;

    }


    this.selectedSeats.update(seats => [
      ...seats,
      seat
    ]);

  }


  isSelected(seat: Seat): boolean {

    return this.selectedSeats().some(
      selectedSeat =>
        selectedSeat.id === seat.id
    );

  }


  getTotalAmount(): number {

    const currentBus = this.bus();

    if (!currentBus) {

      return 0;

    }

    return (
      this.selectedSeats().length *
      currentBus.price
    );

  }


  goBack(): void {

    this.router.navigate(
      ['/bus-search'],
      {
        queryParams: {
          from: this.fromCity(),
          to: this.toCity(),
          date: this.journeyDate()
        }
      }
    );

  }


  continueBooking(): void {

  if (this.selectedSeats().length === 0) {

    this.errorMessage.set(
      'Please select at least one seat.'
    );

    return;
  }


  const currentBus = this.bus();

  if (!currentBus) {

    this.errorMessage.set(
      'Bus information is missing.'
    );

    return;
  }


  this.route.queryParams.subscribe(params => {

    this.router.navigate(
      ['/passenger-details'],
      {
        queryParams: {

          busId: currentBus.id,

          busName: currentBus.operator,

          from: params['from'] || currentBus.fromCity,

          to: params['to'] || currentBus.toCity,

          date: params['date'] || '',

          seats: this.selectedSeats()
            .map(seat => seat.seatNumber)
            .join(',')

        }
      }
    );

  });

}

}
