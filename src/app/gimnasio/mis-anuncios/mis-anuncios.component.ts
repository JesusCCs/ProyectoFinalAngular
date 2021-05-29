import {Component, OnInit} from '@angular/core';
import {Anuncio} from '../../_models/anuncio';
import {GimnasioService} from '../../_services/gimnasio.service';
import {MdbModalService} from 'mdb-angular-ui-kit';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './mis-anuncios.component.html',
  styleUrls: ['./mis-anuncios.component.scss']
})
export class MisAnunciosComponent implements OnInit {

  private anuncios: Array<Anuncio> | null = null;

  constructor(private gimnasioService: GimnasioService,
              private modalService: MdbModalService,
              private fb: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    const anuncios = await this.gimnasioService.anuncios();

    if (!anuncios) {
      return;
    }

    this.anuncios = anuncios;
  }

  onCreateAdd($event: boolean): void {
    console.log($event);
  }
}
