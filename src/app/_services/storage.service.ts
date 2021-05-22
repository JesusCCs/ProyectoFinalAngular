import {Injectable} from '@angular/core';


export const TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh-token';

/**
 * Establece cómo guardará los token jwt la clase LocalStorageService
 * @see StorageService
 * @see StorageService.setMode
 */
export const MODE_SESSION = 'session';

/**
 * Establece cómo guardará los token jwt la clase LocalStorageService. En este caso, que es el que hay por defecto,
 * se podrá recuperar los tokens del localstorage después de que se cierre el anvegador y hasta que
 * se haga un logout por parte del usuario
 * @see StorageService
 * @see StorageService.setMode
 */
export const MODE_LOCAL = 'local';



@Injectable({
  providedIn: 'root'
})
/**
 * Wrapper sobre localStorage y sessionStorage para el mantenimiento de los jwt en el programa
 * @see localStorage
 * @see sessionStorage
 */
export class StorageService {

  mode = 'local';

  /**
   * Necesario llamar antes de continuar con el Login, donde se establecerá si se quiere guardar los tokens
   * jwt mientras el navegador siga abierto con la página, o si se quiere mantener la sesión perdurada en el tiempo
   * (los token se guardan en el localStorage)
   * @param mode
   * @see localStorage
   * @see MODE_SESSION
   * @see MODE_LOCAL
   */
  public setMode(mode: string): void {
    this.mode = mode;
  }

  public set(key: string, value: string): void {
    if (this.mode === MODE_SESSION) {
      sessionStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  public get(key: string): string | null {
    if (this.mode === MODE_SESSION) {
      return sessionStorage.getItem(key);
    } else {
      return localStorage.getItem(key);
    }
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

}
