import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './interceptors/auth-interceptor';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);

export const IT_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),

    // LOCALE ITALIANA
    { provide: LOCALE_ID, useValue: 'it-IT' },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },

    // FORMATO DATE PICKER
    { provide: MAT_DATE_FORMATS, useValue: IT_DATE_FORMATS }
  ]
};