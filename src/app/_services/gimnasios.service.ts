import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {Gimnasio} from '../_models/gimnasio';

@Injectable({
  providedIn: 'root'
})
export class GimnasiosService {

  constructor(private http: HttpClient,
              private storage: StorageService) {
  }

  public async findById(): Promise<Gimnasio> {
    const id = this.storage.getAccessToken()?.getId();

    return await this.http.get<Gimnasio>(`${environment.apiUrl}/gimnasios/${id}`)
      .toPromise().catch(reason => ErrorService.addError(reason)) as Gimnasio;
  }
}
