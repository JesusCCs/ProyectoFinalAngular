import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtTokenService} from './jwt-token.service';
import {LocalStorageService} from './local-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private tokenService: JwtTokenService,
              private storage: LocalStorageService) {

  }

  public login(email: string, password: string): boolean {
    return false;
  }
}
