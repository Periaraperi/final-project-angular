import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/core/routes/app-routes';

import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient()
  ]

});

