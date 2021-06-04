import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService, REFRESH_TOKEN_KEY, TOKEN_KEY, STORAGE_SESSION} from './storage.service';
import {environment} from '../../environments/environment';
import {LoginResponse, RefreshTokenResponse} from '../_models/responses';
import {ErrorService} from './error.service';
import {ChangePasswordRequest, ResetPasswordRequest} from '../_models/requests';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase que tiene todas los métodos encargados de llamar a los endpoint del backend que siguen la ruta /auth
 */
export class AuthService {

  /**
   * La variable de la que partimos para construir todas las rutas en este servicio
   * @private
   */
  private readonly base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient,
              private storage: StorageService,
              private router: Router) {

  }

  /**
   * El login, junto al signUp son los únicos métodos que no usan base para construir la ruta.
   *
   * En el caso del login es debido a que en un inicio se pensó realizar panel admin y de gimnasio, era necesario diferencia entre ambos,
   * luego las rutas siguen el patrón: api/{gimnasios|admin}/login. Es decir, es el único comportamiento del servicio que no llama al
   * controlador de auth si no que se dirige a admin o gimnasios según convenga.
   *
   * Si el resultado del login es correcto guarda las credenciales devueltas (tokens e ids) en el storage.
   *
   * @param userNameOrEmail
   * @param password
   * @param rememberMe
   * @param type
   */
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

  /**
   * Creamos al usuario. Parecido a como resulta en el update de GimnasioService, es necesario mandar los datos a través de un
   * FormData pues puede contener una imagen
   * @param inputs
   * @param file
   *
   * @see GimnasioService.update
   */
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

  /**
   * Limpiamos el storage de los parámetros actuales y mandamos a login
   */
  public logout(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(REFRESH_TOKEN_KEY);

    this.router.navigateByUrl('/login');
  }

  /**
   * Con solo el email el servidor podrá gestionar la solicitud y enviar un correo (si es válido y existe) al usuario para que
   * reinicie su contraseña
   * @param email El email que ha introducido el usuario
   *
   * @see AuthService.resetPassword
   */
  public async forgotPassword(email: string): Promise<boolean> {
    const response = await this.http.post(`${this.base}/forgot-password`, {email})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * Con los parámetros necesario referenciados en la interfaz ResetPasswordRequest el gimnasio puede resetear la contraseña
   *
   * @param resetPassword
   *
   * @see ResetPasswordRequest
   */
  public async resetPassword(resetPassword: ResetPasswordRequest): Promise<boolean> {
    const response = await this.http.put(`${this.base}/reset-password`, resetPassword)
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * Cuando se quiere cambiar la contrsaseña estando ya iniciada la sesión. Es un procedimiento mucho más sencillo
   * que cuando se quiere recuperar, ya que no implica ningún tipo de email con token de seguridad
   * @param resetPassword
   */
  public async changePassword(resetPassword: ChangePasswordRequest): Promise<boolean> {
    resetPassword.authId = this.storage.getAccessToken()?.getAuthId() as string;

    const response = await this.http.put(`${this.base}/change-password`, resetPassword)
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * El proceso de registro no se ve completo hasta que el usuario confirma su email. Este método se encarga de recoger los credenciales
   * que nos llegan en el link de confirmación y mandarlo al servidor para que lo procese
   * @param token
   * @param email
   */
  public async confirmEmail(token: string, email: string): Promise<boolean> {
    const response = await this.http.put(`${this.base}/confirm-email`, {token, email})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * Útil si el usuario quiere cambiar su email por otro. No es un cambio baladí, pues esto implica que podrá iniciar sesión de forma
   * diferente además de que es necesario confirmar este nuevo email
   * @param newEmail
   *
   * @see AuthService.confirmNewEmail
   */
  public async changeEmail(newEmail: string): Promise<boolean> {
    const authId = this.storage.getAccessToken()?.getAuthId() as string;

    const response = await this.http.post(`${this.base}/change-email`, {newEmail, authId})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * Equivalentemente a cuando un usuario se registra y se confirma su email, ahora esta llamada se encarga de confirmar el nuevo email.
   *
   * @param token
   * @param currentEmail
   * @param newEmail
   */
  public async confirmNewEmail(token: string, currentEmail: string, newEmail: string): Promise<boolean> {
    const response = await this.http.put(`${this.base}/confirm-new-email`, {token, currentEmail, newEmail})
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * Método importante. Pues es el que mantiene activa la sesión del usuario mientras utilice la aplicación. Los tokens caducan, así
   * que es necesario llamar periódicamente a este método para pedirle al servidor que nos dé tokens nuevos.
   *
   * Una vez que llega esta petición, si recibimos una respuesta correcta, lo que hacemos es guardar estos nuevos credenciales
   * en el storage.
   */
  public refreshAccessToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${this.base}/refresh-token`,
      {accessToken: this.storage.get(TOKEN_KEY), refreshToken: this.storage.get(REFRESH_TOKEN_KEY)}).pipe(
      tap(x => {
        this.storage.set(TOKEN_KEY, x.accessToken);
        this.storage.set(REFRESH_TOKEN_KEY, x.refreshToken);
      })
    );
  }
}
