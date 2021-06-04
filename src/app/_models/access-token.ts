import jwt_decode from 'jwt-decode';

/**
 * Envoltura sobre el Token. Su motivo de existencia es que con ayuda de la librería 'jwt-decode'
 * somos capaces de almacenar en su estado los Claim que contiene dicho token y poder devolverlos
 *
 * Para devolver estos claim se usan una serie de métodos de conveniencia
 */
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

  /**
   * A partir del token, obtenemos el id del gimnasio
   */
  public getId(): string {
    return this.decodedToken.nameid;
  }

  /**
   * A partir del token, obtenemos el id relacionado con la identificación del usuario
   */
  public getAuthId(): string {
    return this.decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
  }
}
