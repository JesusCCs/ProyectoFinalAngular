import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageService, TOKEN_KEY} from '../_services/local-storage.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(private storage: LocalStorageService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token: string|null = this.storage.get(TOKEN_KEY);

    if (!token) {
      return next.handle(request);
    }

    const requestWithBearer = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });

    return next.handle(requestWithBearer);
  }
}
