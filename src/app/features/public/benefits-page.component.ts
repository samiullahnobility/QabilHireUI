import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-benefits-page",
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: "./benefits-page.component.html",
  styleUrl: "./benefits-page.component.css",
})
export class BenefitsPageComponent {}
