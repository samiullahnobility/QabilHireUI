import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-public-layout",
  imports: [RouterLink, RouterOutlet, MatButtonModule, MatToolbarModule],
  templateUrl: "./public-layout.component.html",
  styleUrl: "./public-layout.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}
