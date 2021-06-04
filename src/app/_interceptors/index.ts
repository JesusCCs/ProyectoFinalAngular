import { HTTP_INTERCEPTORS } from '@angular/common/http';


import {JwtTokenInterceptor} from './jwt-token.interceptor';
import {ErrorInterceptor} from './error.interceptor';

/**
 * Envuelve a los providers de ambos interptores para importarlos más limpiamente en el módulo principal de la app
 */
export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true }
];
