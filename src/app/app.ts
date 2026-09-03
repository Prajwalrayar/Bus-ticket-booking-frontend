import { Component, signal, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.restoreTheme();
  }
}
