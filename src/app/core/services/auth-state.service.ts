import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
 private readonly storageKey = 'loggedInUser';

  currentUser = signal<User | null>(
    this.getStoredUser()
  );


  // ==========================================================
  // GET USER FROM LOCAL STORAGE
  // ==========================================================

  private getStoredUser(): User | null {

    const storedUser =
      localStorage.getItem(this.storageKey);

    if (!storedUser) {

      return null;

    }

    try {

      return JSON.parse(storedUser);

    } catch {

      localStorage.removeItem(this.storageKey);

      return null;

    }

  }


  // ==========================================================
  // LOGIN USER
  // ==========================================================

  setUser(user: User): void {

    this.currentUser.set(user);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(user)
    );

  }


  // ==========================================================
  // GET CURRENT USER
  // ==========================================================

  getUser(): User | null {

    return this.currentUser();

  }


  // ==========================================================
  // CHECK LOGIN
  // ==========================================================

  isLoggedIn(): boolean {

    return this.currentUser() !== null;

  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  logout(): void {

    this.currentUser.set(null);

    localStorage.removeItem(
      this.storageKey
    );

  }

}
