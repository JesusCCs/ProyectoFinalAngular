import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtTokenService} from './jwt-token.service';
import {LocalStorageService, REFRESH_TOKEN_KEY, TOKEN_KEY} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private tokenService: JwtTokenService,
              private storage: LocalStorageService) {

  }

  public login(email: string, password: string, type: string): boolean {

    return false;
  }

  public logout(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(REFRESH_TOKEN_KEY);
  }

  public async forgot(email: any): Promise<boolean> {
    return false;
  }
}
