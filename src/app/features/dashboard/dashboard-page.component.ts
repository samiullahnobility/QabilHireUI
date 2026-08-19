import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({ standalone:true, selector:'app-dashboard-page', imports:[RouterLink], templateUrl:'./dashboard-page.component.html', styleUrl:'./dashboard-page.component.css', changeDetection:ChangeDetectionStrategy.OnPush })
export class DashboardPageComponent {
  private readonly auth = inject(AuthService);
  readonly firstName = this.auth.currentUser()?.fullName.split(' ')[0] || 'Candidate';
  readonly weeks = [{label:'Week 1',score:58},{label:'Week 2',score:66},{label:'Week 3',score:72},{label:'Week 4',score:78}];
}
