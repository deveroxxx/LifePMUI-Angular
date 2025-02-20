import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {ErrorHandlerInterceptor} from './interceptors/error.handler.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import { QuillModule } from 'ngx-quill';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    importProvidersFrom(QuillModule.forRoot({
      modules: {
        toolbar: {
          container: [['bold', 'italic', 'underline', 'strike'],       
          ['blockquote', 'code-block'],
      
          [{ 'color': [] }, { 'background': [] }],         
          [{ 'font': [] }],
          [{ 'align': [] }],
      
          ['clean'],                                        
          ['image']]
        }
      }
    }))
  ]
};

// export const baseUrl = 'http://localhost:8080';
export const baseUrl = '';
export const baseApiUrl = baseUrl + '/api';
