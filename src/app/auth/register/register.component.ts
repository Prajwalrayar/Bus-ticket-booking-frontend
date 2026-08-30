import { Component, signal } from '@angular/core';
import { Register } from '../../core/models/register';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  registerData: Register = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.registerData.name ||
      !this.registerData.email ||
      !this.registerData.phone ||
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

        next: (user: User) => {

          console.log('Registered user:', user);

          this.loading.set(false);

          this.successMessage.set(
            'Registration successful. Redirecting to login...'
          );

          setTimeout(() => {

            this.router.navigate(['/login']);

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
