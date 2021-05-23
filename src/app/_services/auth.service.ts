import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService, REFRESH_TOKEN_KEY, TOKEN_KEY, STORAGE_SESSION} from './storage.service';
import {environment} from '../../environments/environment';
import {LoginResponse, RefreshTokenResponse} from '../_models/responses';
import {ErrorService} from './error.service';
import {ResetPasswordRequest} from '../_models/requests';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private storage: StorageService,
              private router: Router) {

  }

  public async login(userNameOrEmail: string, password: string, rememberMe: boolean, type: string): Promise<boolean> {
    const login: LoginResponse | void = await this.http.post<LoginResponse>(`${environment.apiUrl}/${type}/login`, {
      userNameOrEmail, password, rememberMe
    }).toPromise().catch(reason => ErrorService.addError(reason));

    if (!login) {
      return false;
    }

    if (!rememberMe) {
      this.storage.setMode(STORAGE_SESSION);
    }

    this.storage.set(TOKEN_KEY, login.accessToken);
    this.storage.set(REFRESH_TOKEN_KEY, login.refreshToken);

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
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(REFRESH_TOKEN_KEY);

    this.router.navigateByUrl('/login');
  }

  public async forgotPassword(email: string): Promise<boolean> {
    const response = await this.http.post(`${environment.apiUrl}/auth/forgot-password`, {email})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  public async resetPassword(resetPassword: ResetPasswordRequest): Promise<boolean> {
    const response = await this.http.put(`${environment.apiUrl}/auth/reset-password`, resetPassword)
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  public async confirmEmail(token: string, email: string): Promise<boolean> {
    const response = await this.http.put(`${environment.apiUrl}/auth/confirm-email`, {token, email})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  public refreshAccessToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${environment.apiUrl}/auth/refresh-token`,
      {accessToken : this.storage.get(TOKEN_KEY), refreshToken : this.storage.get(REFRESH_TOKEN_KEY)}).pipe(
        tap(x => {
          this.storage.set(TOKEN_KEY, x.accessToken);
          this.storage.set(REFRESH_TOKEN_KEY, x.refreshToken);
        })
    );
  }
}
