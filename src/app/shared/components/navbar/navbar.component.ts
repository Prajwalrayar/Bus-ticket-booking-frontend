import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { TokenService } from '../../../core/services/token-service';
import { NotificationService } from '../../../core/services/notification.service';
import { APP_CONSTANTS } from '../../../core/constants/app-constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  userRoles: string[] = [];
  isMenuCollapsed = true;
  unreadNotificationCount: number = 0;
  
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private notifSub?: Subscription;

  readonly roles = APP_CONSTANTS.ROLES;

  constructor(
    private authStateService: AuthStateService,
    private tokenService: TokenService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateAuthState();
    // Poll auth state periodically so navbar stays synced after login/logout
    this.checkInterval = setInterval(() => this.updateAuthState(), 1000);
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.notifSub?.unsubscribe();
  }

  private updateAuthState(): void {
    const wasLoggedIn = this.isLoggedIn;
    this.isLoggedIn = this.tokenService.isValid();

    if (this.isLoggedIn) {
      const user = this.authStateService.getUser();
      this.userName = user?.name || user?.email || 'User';
      this.userRoles = this.tokenService.getRoles();
      
      if (this.isCustomer && this.unreadNotificationCount === 0) {
        this.fetchUnreadCount();
      }
    } else if (wasLoggedIn) {
      this.userName = '';
      this.userRoles = [];
      this.unreadNotificationCount = 0;
      this.notifSub?.unsubscribe();
    }
  }

  private fetchUnreadCount(): void {
    this.notifSub = this.notificationService.getMyUnreadNotifications().subscribe({
      next: (notifications) => {
        this.unreadNotificationCount = notifications.length;
      },
      error: (err) => console.error('Failed to fetch unread notifications', err)
    });
  }

  get isAdmin(): boolean {
    return this.userRoles.includes(this.roles.ADMIN);
  }

  get isOperator(): boolean {
    return this.userRoles.includes(this.roles.BUS_OPERATOR);
  }

  get isCustomer(): boolean {
    return this.userRoles.includes(this.roles.CUSTOMER);
  }

  get userInitial(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout(): void {
    this.authStateService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.userRoles = [];
    this.router.navigate(['/']);
  }
}
