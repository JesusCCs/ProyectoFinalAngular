import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtTokenService} from './jwt-token.service';
import {LocalStorageService, REFRESH_TOKEN_KEY, TOKEN_KEY} from './local-storage.service';
import {environment} from '../../environments/environment';
import {LoginResponse} from '../_models/response';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userIsLogged = false;

  constructor(private http: HttpClient,
              private tokenService: JwtTokenService,
              private storageService: LocalStorageService) {

  }

  public async login(userNameOrEmail: string, password: string, rememberMe: boolean, type: string): Promise<boolean> {
    const login: LoginResponse | void = await this.http.post<LoginResponse>(`${environment.apiUrl}/${type}/login`, {
      userNameOrEmail, password, rememberMe
    }).toPromise().catch(reason => ErrorService.addError(reason));

    return this.initLogin(login, rememberMe);
  }

  private initLogin(login: LoginResponse | void, rememberMe: boolean): boolean {
    if (!login) {
      return false;
    }


    return true;
  }

  public async signUp(inputs: any, file: File): Promise<boolean> {
    const form = new FormData();

    for (const [key, value] of Object.entries(inputs)) {
      form.set(key, String(value).trim());
    }

    form.set('logo', file);

    const response = await this.http.post(`${environment.apiUrl}/gimnasios`, form)
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  public logout(): void {
    this.storageService.remove(TOKEN_KEY);
    this.storageService.remove(REFRESH_TOKEN_KEY);
  }

  public async forgotPassword(email: any): Promise<boolean> {
    return false;
  }

  async confirmEmail(token: string, email: string): Promise<boolean> {
    const response = await this.http.put(`${environment.apiUrl}/auth/confirm-email`, {token, email})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }
}
