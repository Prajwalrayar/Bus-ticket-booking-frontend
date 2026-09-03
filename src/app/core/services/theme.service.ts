import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
  }

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  restoreTheme(): void {
    this.setTheme(this.getCurrentTheme());
  }
}
