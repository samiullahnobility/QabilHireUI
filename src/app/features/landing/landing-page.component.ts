import { Component, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { RouterLink } from "@angular/router";
import { RevealDirective } from "../../core/directives/reveal.directive";

@Component({
  standalone: true,
  selector: "app-landing-page",
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    RevealDirective,
  ],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.css",
})
export class LandingPageComponent {
  readonly readiness = signal(0);
  readonly communication = signal(0);
  readonly confidence = signal(0);

  constructor() {
    // Stagger the hero metrics so the preview animates on load.
    setTimeout(() => this.readiness.set(82), 400);
    setTimeout(() => this.communication.set(74), 750);
    setTimeout(() => this.confidence.set(68), 1100);
  }
}
