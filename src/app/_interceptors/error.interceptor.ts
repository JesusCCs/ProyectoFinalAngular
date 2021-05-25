import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 0) {
          return throwError({
            general: ['Fallo en la conexión con el servidor']
          });
        }

        if (err.status === 500) {
          return throwError({
            general: ['Hubo un fallo interno en el servidor']
          });
        }

        if (err.status === 403) {
          return throwError({
            general: ['No tiene permisos para realizar esta acción']
          });
        }

        const error = err.status === 400 ? err.error.errors : null;

        return throwError(error);
      })
    );
  }
}
