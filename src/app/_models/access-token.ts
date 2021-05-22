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
}
