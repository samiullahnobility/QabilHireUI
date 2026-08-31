import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { RevealDirective } from "../../core/directives/reveal.directive";

@Component({
  standalone: true,
  selector: "app-how-it-works-page",
  imports: [RouterLink, MatButtonModule, MatCardModule, RevealDirective],
  templateUrl: "./how-it-works-page.component.html",
  styleUrl: "./how-it-works-page.component.css",
})
export class HowItWorksPageComponent {}
