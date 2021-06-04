import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {Anuncio} from '../_models/anuncio';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase que tiene todas los métodos encargados de llamar a los endpoint del backend que siguen la ruta /anuncios
 */
export class AnuncioService {

  /**
   * La variable de la que partimos para construir todas las rutas en este servicio
   * @private
   */
  private readonly base = `${environment.apiUrl}/anuncios`;

  constructor(private http: HttpClient,
              private storage: StorageService) {
  }


  /**
   * Se crea un anuncio. Esto es solo el inicio. Pues es necesario también realizar llamadas posteriores a otras rutas y con los
   * datos correspondientes para ir finalizando el anuncio
   * @param recurso El fichero con el que se creará el anuncio
   *
   * @return Promise<string | void> Devolvemos el ID del anuncio recién creado o no se obtiene nada si hubo un error en el servidor
   *
   * @see AnuncioService.updateDetails
   * @see AnuncioService.setStatus
   */
  public async create(recurso: File): Promise<string | void> {
    const id = this.storage.getAccessToken()?.getId() as string;

    const form = new FormData();
    form.set('recurso', recurso);
    form.set('gimnasioId', id);

    return await this.http.post<string>(this.base, form)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }

  /**
   * Actualizamos el anuncio creado con los detalles, estos son, las fechas de inicio y fin del anuncio y el número de
   * reproducciones máximas que se permiten. Es imprescindible haber llamado antes a la creación y haber obtenido un id correcto
   * @param anuncioId
   * @param details
   *
   * @see AnuncioService.create
   */
  public async updateDetails(anuncioId: string, details: any): Promise<Anuncio | void> {
    return await this.http.put<Anuncio>(this.base + `/${anuncioId}/details`, details)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }

  /**
   * Actualizamos el fichero del anuncio creado. Por si durante el modal, el usuario se ha equivocado de archivo y quiere subir uno nuevo
   * Hay que tener en cuenta que siempre se realizan comprobaciones, luego no siempre este update va a resultar existoso si el nuevo
   * fichero es inválido
   *
   * @param anuncioId El id del anuncio a actualizar
   * @param recurso El nuevo fichero a subir
   */
  async updateFile(anuncioId: string, recurso: File): Promise<string | void> {
    const id = this.storage.getAccessToken()?.getId() as string;

    const form = new FormData();
    form.set('recurso', recurso);
    form.set('gimnasioId', id);

    return await this.http.put<string>(this.base + `/${anuncioId}/recurso`, form)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }

  /**
   * Enviamos las fechas escogidas al servidor para que nos confirme si están disponibles
   * @param inicio
   * @param fin
   */
  async checkDates(inicio: string, fin: string): Promise<boolean | void> {
    return await this.http.get<boolean>(this.base + `/${inicio}/${fin}`)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }

  /**
   * Método que sirve tanto para finalizar y confirmar la creación del anuncio como para lo contrario. Depende del parámetro que le pasemos
   * @param anuncioId El anuncio que queremos confirmar/rechazar
   * @param finalizado True si queremos confirmar la creación, False si vamos a cancelar la operación (cerrar el modal)
   */
  async setStatus(anuncioId: string, finalizado: boolean): Promise<Anuncio | void> {
    return await this.http.put<Anuncio>(this.base + `/${anuncioId}/finalizado`, {finalizado})
      .toPromise().catch(reason => ErrorService.addError(reason));
  }

  /**
   * Podemos desactivar anuncios. De forma que ya no se mostrarán al usuario en la aplicación móvil y su fecha quedará libre para que
   * la ocupen otros anunciantes
   * @param anuncioId
   */
  async desactivar(anuncioId: string): Promise<void> {
    await this.http.put(this.base + `/${anuncioId}`, {activo: false})
      .toPromise().catch(reason => ErrorService.addError(reason));
  }
}
