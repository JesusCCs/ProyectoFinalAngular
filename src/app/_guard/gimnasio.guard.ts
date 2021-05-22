import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
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

    this.router.navigate(['/login']);


    return false;
  }

}
