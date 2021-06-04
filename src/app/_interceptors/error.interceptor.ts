import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * Envuelve al interceptador de peticiones que se encarga de observar si hay errores en el response y construir un mensaje
 * que se vuelve a lanzar para que se recoja más adelante en la aplicación y mostrarlo en pantalla
 * Los que controla son:
 *
 * -   0, No hubo conexión con el servidor
 *
 * - 500, para dar parte de que hubo un error interno
 *
 * - 403 , que es cuando no solo el token de acceso se ha caducado, si no también el de refresh
 *
 * - 400, errores correspondientes con datos enviados con formato inadecuado o excepciones del servidor que son conocidas y controladas por parte
 * de éste.
 */
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
