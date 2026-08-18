import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-features-page',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './features-page.component.html',
  styleUrl: './features-page.component.css'
})
export class FeaturesPageComponent {}
