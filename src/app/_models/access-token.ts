import jwt_decode from 'jwt-decode';

export class AccessToken {

  private readonly decodedToken: { [key: string]: string; };

  constructor(private token: string) {
    this.decodedToken = jwt_decode(token);
  }

  public isGimnasio(): boolean {
    return this.decodedToken.role === 'Gimnasio';
  }

  public isAdmin(): boolean {
    return this.decodedToken.role === 'Admin';
  }

  public getId(): string {
    return this.decodedToken.nameid;
  }

  public getAuthId(): string {
    return this.decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
  }
}
