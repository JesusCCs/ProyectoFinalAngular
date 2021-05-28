import {Injectable} from '@angular/core';
import {AccessToken} from '../_models/access-token';


export const TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh-token';

/**
 * Establece cómo guardará los token jwt la clase StorageService. Con esta constante se establecerá que
 * se debe usar el sessionStorage para mantener los tokens solo mientras perdure las pestañas de la aplicación
 * abiertas en el navegador
 * @see StorageService.setMode
 */
export const STORAGE_SESSION = 'session';

/**
 * Establece cómo guardará los token jwt la clase StorageService. En este caso, que es el que hay por defecto,
 * se podrá recuperar los tokens del localstorage después de que se cierre el navegador y hasta que
 * se haga un logout por parte del usuario
 * @see StorageService.setMode
 */
export const STORAGE_LOCAL = 'local';



/**
 * Wrapper sobre localStorage y sessionStorage para el mantenimiento de los jwt en la aplicación
 * @see localStorage
 * @see sessionStorage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private mode;

  constructor() {
    const mode = sessionStorage.getItem('mode');
    this.mode = mode ? mode : 'local';
  }

  /**
   * Necesario llamar antes de continuar con el Login, donde se establecerá si se quiere guardar los tokens
   * jwt mientras el navegador siga abierto con la página, o si se quiere mantener la sesión perdurada en el tiempo
   * (los token se guardan en el localStorage)
   * @param mode
   * @see localStorage
   * @see STORAGE_SESSION
   * @see STORAGE_LOCAL
   */
  public setMode(mode: string): void {
    this.mode = mode;
    // Guardamos el modo de la sesión también, para que en una recarga de página, sea accesible de nuevo
    sessionStorage.setItem('mode', mode);
  }

  public set(key: string, value: string): void {
    if (this.mode === STORAGE_SESSION) {
      sessionStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  public get(key: string): string | null {
    if (this.mode === STORAGE_SESSION) {
      return sessionStorage.getItem(key);
    } else {
      return localStorage.getItem(key);
    }
  }

  /**
   * Método de conveniencia para obtener el access token (si existe) del storage directamente
   */
  public getAccessToken(): AccessToken | null {
    const token = this.get(TOKEN_KEY);

    if (!token) {
      return null;
    }

    return new AccessToken(token);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

}
