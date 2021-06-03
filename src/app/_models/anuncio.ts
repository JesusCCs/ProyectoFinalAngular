export interface Anuncio {
  id: string;
  reproduccionesLimite: number;
  reproducciones: number;
  tipo: string;
  inicio: Date;
  fin: Date;
  activo: boolean;
  recurso: string;
}
