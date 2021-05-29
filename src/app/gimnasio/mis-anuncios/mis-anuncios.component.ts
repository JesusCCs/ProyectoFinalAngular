import {Component, OnInit} from '@angular/core';
import {Anuncio} from '../../_models/anuncio';
import {GimnasioService} from '../../_services/gimnasio.service';
import {MdbModalService} from 'mdb-angular-ui-kit';
import {FormBuilder} from '@angular/forms';
import {Element} from '@angular/compiler';

@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './mis-anuncios.component.html',
  styleUrls: ['./mis-anuncios.component.scss']
})
export class MisAnunciosComponent implements OnInit {

  anuncios: Array<Anuncio> | null = null;
  hayAnuncios = false;

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

    this.hayAnuncios = anuncios.length > 0;
  }

  onCreateAd($event: boolean): void {
    console.log($event);
  }

  onWheel(event: WheelEvent): void {
    document.getElementById('container')!.scrollLeft += event.deltaY;
  }
}
