import { Component, signal } from '@angular/core';
import { Bus } from '../../core/models/bus';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from '../../core/services/bus.service';

@Component({
  selector: 'app-bus-search',
  templateUrl: './bus-search.component.html',
  styleUrl: './bus-search.component.css',
})

export class BusSearchComponent {
  
  buses: Bus[] = [];

  fromCity = '';
  toCity = '';
  journeyDate = '';

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.fromCity = params['from'] || '';
      this.toCity = params['to'] || '';
      this.journeyDate = params['date'] || '';

      this.searchBuses();

    });

  }

  private searchBuses(): void {

    if (!this.fromCity || !this.toCity) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.busService
      .searchBuses(
        this.fromCity,
        this.toCity,
        this.journeyDate
      )
      .subscribe({

        next: (data: Bus[]) => {

          console.log('Buses received:', data);

          this.buses = data;

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error searching buses:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            'Unable to load buses. Please try again.'
          );

        }

      });

  }

  modifySearch(): void {

  this.router.navigate(['/'], {
    queryParams: {
      from: this.fromCity,
      to: this.toCity,
      date: this.journeyDate
    }
  });

}

viewSeats(bus: Bus): void {

  this.router.navigate(
    ['/seat-selection'],
    {
      queryParams: {
        tripId: bus.tripId,
        from: this.fromCity,
        to: this.toCity,
        date: this.journeyDate
      }
    }
  );

}
}
