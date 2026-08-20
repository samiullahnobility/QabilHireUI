import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiLoadingOverlayComponent } from './core/components/api-loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ApiLoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
