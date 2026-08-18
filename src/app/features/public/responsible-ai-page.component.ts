import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-responsible-ai-page',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './responsible-ai-page.component.html',
  styleUrl: './responsible-ai-page.component.css'
})
export class ResponsibleAiPageComponent {}
