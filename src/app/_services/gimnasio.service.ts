import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {Gimnasio} from '../_models/gimnasio';
import {Anuncio} from '../_models/anuncio';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase que tiene todas los métodos encargados de llamar a los endpoint del backend que siguen la ruta /gimnasios
 */
export class GimnasioService {

  /**
   * La variable de la que partimos para construir todas las rutas en este servicio
   * @private
   */
  private readonly base = `${environment.apiUrl}/gimnasios`;

  constructor(private http: HttpClient,
              private storage: StorageService) {
  }

  public async findById(): Promise<Gimnasio> {
    const id = this.storage.getAccessToken()?.getId();

    return await this.http.get<Gimnasio>(`${this.base}/${id}`)
      .toPromise().catch(reason => ErrorService.addError(reason)) as Gimnasio;
  }

  /**
   * Actualizamos los datos del gimnasio. Como puede haber un fichero, no se envía un json, si no que el backend
   * espera un FormData, luego hay que construirlo a partir de los inputs dados
   * @param inputs
   * @param file
   */
  public async update(inputs: { [p: string]: any }, file: File | null): Promise<boolean> {
    const id = this.storage.getAccessToken()?.getId();
    const form = new FormData();

    form.set('id', String(id));

    for (const [key, value] of Object.entries(inputs)) {
      form.set(key, value);
    }

    if (file) {
      form.set('logo', file);
    }

    const response = await this.http.put(`${this.base}/${id}`, form)
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }

  /**
   * Conseguimos los anuncios del gimnasio con el que nos encontramos logueados
   */
  public async anuncios(): Promise<Array<Anuncio> | void> {
    const id = this.storage.getAccessToken()?.getId();

    return await this.http.get<Array<Anuncio>>(`${this.base}/${id}/anuncios`)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }
}
