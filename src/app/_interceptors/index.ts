import { HTTP_INTERCEPTORS } from '@angular/common/http';


import {JwtTokenInterceptor} from './jwt-token.interceptor';
import {ErrorInterceptor} from './error.interceptor';


export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true }
];
