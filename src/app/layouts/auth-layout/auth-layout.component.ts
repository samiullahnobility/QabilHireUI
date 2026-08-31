import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-auth-layout",
  imports: [RouterOutlet],
  templateUrl: "./auth-layout.component.html",
  styleUrl: "./auth-layout.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
