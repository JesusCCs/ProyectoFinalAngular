import { HTTP_INTERCEPTORS } from '@angular/common/http';


import {JwtTokenInterceptor} from './jwt-token.interceptor';


export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
]
