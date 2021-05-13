import {Injectable} from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  private jwtToken: string | undefined;
  private decodedToken: { [key: string]: string; } | undefined;

  constructor() {
  }

  public setToken(token: string): void {
    this.jwtToken = token;
    this.decodedToken = jwt_decode(this.jwtToken);
  }

  isTokenExpired(): boolean {
    const expiration: number | null = this.decodedToken ? +this.decodedToken.exp : null;

    if (!expiration) {
      return false;
    }

    return ((1000 * expiration) - (new Date()).getTime()) < 5000;
  }
}
