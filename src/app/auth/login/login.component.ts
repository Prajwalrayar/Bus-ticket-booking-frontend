import { Component, signal } from '@angular/core';
import { User } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Login, LoginResponse } from '../../core/models/login';
import { AuthStateService } from '../../core/services/auth-state.service';
import { TokenService } from '../../core/services/token-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})


export class LoginComponent {

  loginData: Login = {
    email: '',
    password: ''
  };

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private authStateService:AuthStateService,
    private tokenService: TokenService
  ) { }

  login(): void {

    if (!this.loginData.email || !this.loginData.password) {

      this.errorMessage.set(
        'Please enter email and password.'
      );

      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginData)
      .subscribe({

        next: (response: LoginResponse) => {

          this.loading.set(false);

          if (!response || !response.token) {

            this.errorMessage.set(
              'Invalid email or password.'
            );

            return;
          }

          this.tokenService.setToken(response.token);

          const user: User = {
            userId: response.userId,
            name: '',
            email: this.loginData.email,
            phone: '',
            password: '',
            roles: response.roles,
          };

          this.authStateService.setUser(user);

          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl');

          if (returnUrl) {

            this.router.navigateByUrl(returnUrl);

          } else {

            this.router.navigate(['/']);

          }

        },

        error: (error) => {

          console.error('Login error:', error);

          this.loading.set(false);

          this.errorMessage.set(
            'Unable to login. Please try again.'
          );
        }

      });

  }
}
