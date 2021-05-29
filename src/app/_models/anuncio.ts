export interface Anuncio {
  id: string;
  reproduccionesLimite: number;
  tipo: string;
  inicio: Date;
  fin: Date;
  activo: boolean;
  recurso: string;
}
