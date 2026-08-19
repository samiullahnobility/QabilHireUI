import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), provideHttpClient(withInterceptors([authInterceptor])), provideRouter(routes), provideToastr({ positionClass: 'toast-top-right', timeOut: 4000 })]
}).catch((error) => console.error(error));
