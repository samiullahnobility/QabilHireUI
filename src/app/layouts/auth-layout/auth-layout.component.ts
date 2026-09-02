import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-auth-layout",
  imports: [RouterLink, RouterOutlet, MatIconModule],
  templateUrl: "./auth-layout.component.html",
  styleUrl: "./auth-layout.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
