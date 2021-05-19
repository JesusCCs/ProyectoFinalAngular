import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../_services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 0) {
        return throwError({
          general : ['Fallo en la conexión con el servidor']
        });
      }

      if ([401, 403].includes(err.status) && this.authService.userIsLogged) {
        this.authService.logout();
      }

      const error = err.status === 400 ? err.error.errors : null;

      return throwError(error);
    }));
  }
}
