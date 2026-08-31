import { Component, signal } from '@angular/core';
import { Register, RegisterResponse } from '../../core/models/register';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token-service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  registerData: Register = {
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  };

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private authStateService: AuthStateService
  ) {}

  register(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.registerData.fullName ||
      !this.registerData.email ||
      !this.registerData.mobileNumber ||
      !this.registerData.password ||
      !this.registerData.confirmPassword
    ) {

      this.errorMessage.set(
        'Please fill in all fields.'
      );

      return;
    }


    if (
      this.registerData.password !==
      this.registerData.confirmPassword
    ) {

      this.errorMessage.set(
        'Passwords do not match.'
      );

      return;
    }


    this.loading.set(true);


    this.authService
      .register(this.registerData)
      .subscribe({

        next: (response: RegisterResponse) => {

          console.log('Registered user:', response);

          this.loading.set(false);

          if (response && response.token) {
            this.tokenService.setToken(response.token);

            const user: User = {
              userId: response.userId,
              name: this.registerData.fullName,
              email: this.registerData.email,
              phone: this.registerData.mobileNumber,
              password: '',
              roles: response.roles,
            };

            this.authStateService.setUser(user);
          }

          this.successMessage.set(
            'Registration successful. Redirecting to login...'
          );

          setTimeout(() => {

            this.router.navigate(['/auth/login']);

          }, 1000);

        },


        error: (error) => {

          console.error('Registration error:', error);

          this.loading.set(false);

          if (
            error.message ===
            'Email already registered'
          ) {

            this.errorMessage.set(
              'This email is already registered.'
            );

          } else {

            this.errorMessage.set(
              'Unable to register. Please try again.'
            );

          }

        }

      });

  }
}
