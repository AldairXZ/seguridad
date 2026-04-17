import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { apiInterceptor } from './interceptors/api.interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // AQUI SE IMPLEMENTA EL INTERCEPTOR EN LA CONFIGURACION GLOBAL
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideAnimations(),
    MessageService
  ]
};
