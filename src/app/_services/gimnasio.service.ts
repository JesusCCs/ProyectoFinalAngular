import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {Gimnasio} from '../_models/gimnasio';

@Injectable({
  providedIn: 'root'
})
export class GimnasioService {

  constructor(private http: HttpClient,
              private storage: StorageService) {
  }

  public async findById(): Promise<Gimnasio> {
    const id = this.storage.getAccessToken()?.getId();

    return await this.http.get<Gimnasio>(`${environment.apiUrl}/gimnasios/${id}`)
      .toPromise().catch(reason => ErrorService.addError(reason)) as Gimnasio;
  }

  public async update(inputs: any, file: File | null): Promise<boolean> {
    const id = this.storage.getAccessToken()?.getId();
    const form = new FormData();

    form.set('id', String(id));

    for (const [key, value] of Object.entries(inputs)) {
      form.set(key, String(value).trim());
    }

    if (file) {
      form.set('logo', file);
    }

    const response = await this.http.put(`${environment.apiUrl}/gimnasios/${id}`, form)
      .toPromise().catch(reason => ErrorService.addError(reason));

    return response !== undefined;
  }
}
