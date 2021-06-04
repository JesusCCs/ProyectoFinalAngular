import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {REFRESH_TOKEN_KEY, StorageService, TOKEN_KEY} from '../_services/storage.service';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../_services/auth.service';
import {RefreshTokenResponse} from '../_models/responses';

/**
 * Este interceptor controla errores de parte del servidor, pero concentrándose en los que son por problemas de autorización 401. Miramos
 * concretamente estos, porque debido a que hay un sistema de tokens y refrescos de éstos, lo que ha ocurrido es que el token original
 * se ha caducado y es necesario enviar el de refresco para obtener uno nuevo.
 *
 * Otra funcionalidad además de interceptar errores, es añadir a cualquier petición que se envié la autorización con el token
 * de seguridad almacenado en el storage que haya en el momento
 */
@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  /**
   * Bandera para conocer el estado actual del refresco del token
   * @private
   */
  private refreshTokenInProgress = false;

  /**
   * Observable para subscribirnos a él y conocer el moento exacto en el que el refresh token se ha completado y podemos continuar con
   * la petición
   * @private
   */
  private refreshTokenSubject: Subject<RefreshTokenResponse | null> = new BehaviorSubject<RefreshTokenResponse | null>(null);

  constructor(private storage: StorageService,
              private auth: AuthService) {
  }


  /**
   * Aquí interceptamos el error que solo es 401 o le añadimos la autorización a la petición
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addBearer(request)).pipe(catchError(err => {
      if (err.status !== 401) {
        return throwError(err);
      }

      const accessToken = this.storage.get(TOKEN_KEY);
      const refreshToken = this.storage.get(REFRESH_TOKEN_KEY);

      if (refreshToken && accessToken) {
        return this.refreshToken(request, next);
      }

      return throwError(err);
    }));
  }

  /**
   * Método de apoyo para añadir el token a la petición
   * @param request
   * @private
   */
  private addBearer(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken: string | null = this.storage.get(TOKEN_KEY);

    if (!accessToken) {
      return request;
    }

    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
    });
  }

  /**
   * Si hay un refresh token se puede llamar a este método, que lo que hará será una petición al servidor para obtener nuevos credenciales
   * Además, una vez que se obtienen, se repite el request añadiéndole estos nuevos tokens
   * @param request
   * @param next
   * @private
   */
  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.refreshTokenInProgress) {
      // Si ya estamos enviando un request para refrescar el token, esperamos a que termine
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => next.handle(this.addBearer(request)))
      );
    } else {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refreshAccessToken().pipe(
        // Completado el refresh, enviamos de nuevo el request que queríamos con el nuevo Access Token
        switchMap(() => next.handle(this.addBearer(request))),
        // Al terminar con la llamada al refresh, volvemos a marcar la bandera a falso
        finalize(() => this.refreshTokenInProgress = false)
      );
    }
  }
}
