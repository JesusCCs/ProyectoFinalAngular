import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService, TOKEN_KEY} from '../_services/storage.service';



@Injectable({
  providedIn: 'root'
})

/**
 * Es el guardían para las rutas que necesitan de un login exitoso.
 * El único método que implemte es el de canActivate, donde se comprueba que hay un token guardado
 * en la sesión
 */
export class GimnasioGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (state.url === '/login') {
      return true;
    }

    const token = this.storage.getAccessToken();

    if (!token || !token.isGimnasio()) {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }

}
