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

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<RefreshTokenResponse | null> = new BehaviorSubject<RefreshTokenResponse | null>(null);

  constructor(private storage: StorageService,
              private auth: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addBearer(request)).pipe(catchError(err => {
      if (err.status === 401) {
        const accessToken = this.storage.get(TOKEN_KEY);
        const refreshToken = this.storage.get(REFRESH_TOKEN_KEY);

        if (refreshToken && accessToken) {
          return this.refreshToken(request, next);
        }

        return this.logout(err);
      }

      if (err.status === 403) {
        return this.logout(err);
      }


      return throwError(err);
    }));
  }

  private addBearer(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken: string | null = this.storage.get(TOKEN_KEY);

    if (!accessToken) {
      return request;
    }

    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
    });
  }

  private logout(err: any): Observable<HttpEvent<any>> {
    this.auth.logout();
    return throwError(err);
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.refreshTokenInProgress) {
      // Si ya estamos enviando un request para refrescar el token, esperamos a que termine
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(subject => next.handle(this.addBearer(request)))
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
