import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { cartIdInterceptor } from './interceptors/cart-id.interceptor';

// Precios en formato colombiano: $ 89.900
registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([cartIdInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
};
