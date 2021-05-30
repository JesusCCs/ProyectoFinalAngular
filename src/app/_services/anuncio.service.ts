import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  private readonly base = `${environment.apiUrl}/anuncios`;

  constructor(private http: HttpClient,
              private storage: StorageService) {
  }


  public async create(recurso: File): Promise<string | void> {
    const id = this.storage.getAccessToken()?.getId() as string;

    const form = new FormData();
    form.set('recurso', recurso);
    form.set('gimnasioId', id);

    return await this.http.post<string>(this.base, form)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }

  async updateFile(anuncioId: string, recurso: File): Promise<string | void> {
    const id = this.storage.getAccessToken()?.getId() as string;

    const form = new FormData();
    form.set('recurso', recurso);
    form.set('gimnasioId', id);

    return await this.http.put<string>(this.base + `/${anuncioId}/recurso`, form)
      .toPromise().catch(reason => ErrorService.addError(reason));
  }
}
