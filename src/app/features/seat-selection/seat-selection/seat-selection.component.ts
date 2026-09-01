import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripDTO } from '../../../core/models/trip';
import { TripSeatDTO } from '../../../core/models/seat';
import { TripService } from '../../../core/services/trip.service';
import { SeatService } from '../../../core/services/seat.service';

@Component({
  selector: 'app-seat-selection',
  standalone: false,
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css',
})
export class SeatSelectionComponent implements OnInit {
  bus = signal<TripDTO | null>(null);
  seats = signal<TripSeatDTO[]>([]);
  selectedSeats = signal<TripSeatDTO[]>([]);

  loading = signal(false);
  errorMessage = signal('');
  fromCity = signal('');
  toCity = signal('');
  journeyDate = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private seatService: SeatService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tripId = params['tripId'];

      this.fromCity.set(params['from'] || '');
      this.toCity.set(params['to'] || '');
      this.journeyDate.set(params['date'] || '');

      if (!tripId) {
        this.errorMessage.set('Bus information is missing.');
        return;
      }

      this.loadBus(tripId);
      this.loadSeats(tripId);
    });
  }

  loadBus(tripId: string): void {
    this.loading.set(true);
    this.tripService.getTripById(tripId).subscribe({
      next: (response) => {
        if (response.data) {
          this.bus.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Unable to load bus:', error);
        this.loading.set(false);
        this.errorMessage.set('Unable to load bus details.');
      }
    });
  }

  loadSeats(tripId: string): void {
    this.seatService.getTripSeats(tripId).subscribe({
      next: (response) => {
        this.seats.set(response.data || []);
      },
      error: (error) => {
        console.error('Unable to load seats:', error);
        this.errorMessage.set('Unable to load seats.');
      }
    });
  }

  selectSeat(seat: TripSeatDTO): void {
    if (seat.seatStatus === 'TEMPORARILY_LOCKED' || seat.seatStatus === 'BOOKED') {
      return;
    }

    const alreadySelected = this.selectedSeats().some(s => s.tripSeatId === seat.tripSeatId);

    if (alreadySelected) {
      this.selectedSeats.update(seats => seats.filter(s => s.tripSeatId !== seat.tripSeatId));
      return;
    }

    this.selectedSeats.update(seats => [...seats, seat]);
  }

  isSelected(seat: TripSeatDTO): boolean {
    return this.selectedSeats().some(s => s.tripSeatId === seat.tripSeatId);
  }

  getTotalAmount(): number {
    return this.selectedSeats().reduce((total, seat) => total + (seat.seatFare || 0), 0);
  }

  goBack(): void {
    this.router.navigate(['/search'], {
      queryParams: {
        from: this.fromCity(),
        to: this.toCity(),
        date: this.journeyDate()
      }
    });
  }

  continueBooking(): void {
    if (this.selectedSeats().length === 0) {
      this.errorMessage.set('Please select at least one seat.');
      return;
    }

    const currentBus = this.bus();
    if (!currentBus) {
      this.errorMessage.set('Bus information is missing.');
      return;
    }

    const seatIds = this.selectedSeats().map(seat => seat.tripSeatId);
    
    // Perform temporary lock
    this.seatService.lockSeats(currentBus.tripId, seatIds).subscribe({
      next: (response) => {
        // Lock successful, proceed to passenger details
        this.router.navigate(['/passenger-details'], {
          queryParams: {
            tripId: currentBus.tripId,
            busName: currentBus.operatorName,
            from: this.fromCity() || currentBus.source,
            to: this.toCity() || currentBus.destination,
            date: this.journeyDate(),
            seats: this.selectedSeats().map(s => s.seatNumber).join(',')
          }
        });
      },
      error: (err) => {
        console.error('Failed to lock seats:', err);
        this.errorMessage.set('Some of the selected seats are no longer available. Please select different seats.');
        // Refresh the seat layout to show current availability
        this.loadSeats(currentBus.tripId);
        // Clear selection
        this.selectedSeats.set([]);
      }
    });
  }
}
