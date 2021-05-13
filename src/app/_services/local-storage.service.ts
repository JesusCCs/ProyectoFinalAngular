import {Injectable} from '@angular/core';


const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

}
