import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../core/models/user';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  fromCity = '';
  toCity = '';
  journeyDate = '';

  minDate = '';

  errorMessage = '';
  currentUser;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authStateService: AuthStateService
  ) {

    // Use the signal from AuthStateService
    this.currentUser =
      this.authStateService.currentUser;


    const today = new Date();

    this.minDate =
      today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

  }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.fromCity = params['from'] || '';

      this.toCity = params['to'] || '';

      this.journeyDate = params['date'] || '';

    });

  }


  swapLocations(): void {

    const temporaryCity = this.fromCity;

    this.fromCity = this.toCity;

    this.toCity = temporaryCity;

  }


  searchBuses(): void {

    this.errorMessage = '';

    if (
      !this.fromCity ||
      !this.toCity ||
      !this.journeyDate
    ) {

      this.errorMessage =
        'Please enter departure city, destination city and journey date.';

      return;

    }


    if (
      this.fromCity.trim().toLowerCase() ===
      this.toCity.trim().toLowerCase()
    ) {

      this.errorMessage =
        'Departure and destination cities cannot be the same.';

      return;

    }


    this.router.navigate(
      ['/bus-search'],
      {
        queryParams: {

          from: this.fromCity,

          to: this.toCity,

          date: this.journeyDate

        }

      }
    );

  }


  logout(): void {

    this.authStateService.logout();

    this.router.navigate(['/']);

  }
}
