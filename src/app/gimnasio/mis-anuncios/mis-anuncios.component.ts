import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Anuncio} from '../../_models/anuncio';
import {GimnasioService} from '../../_services/gimnasio.service';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit';
import {FormBuilder} from '@angular/forms';
import {ModalNewAdComponent} from '../../_components/modal-new-ad/modal-new-ad.component';

@Component({
  selector: 'app-mis-anuncios',
  templateUrl: './mis-anuncios.component.html',
  styleUrls: ['./mis-anuncios.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MisAnunciosComponent implements OnInit {

  anuncios!: Array<Anuncio>;
  hayAnuncios = false;

  modalCreateNewAd!: MdbModalRef<ModalNewAdComponent>;

  constructor(private gimnasioService: GimnasioService,
              private modalService: MdbModalService,
              private fb: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    const anuncios = await this.gimnasioService.anuncios();

    this.anuncios = new Array<Anuncio>();

    if (!anuncios) {
      return;
    }

    this.anuncios = anuncios;
    this.hayAnuncios = anuncios.length > 0;

  }

  onCreateAd(): void {
    this.openModalNewAd();
  }

  onWheel(event: WheelEvent): void {
    const container = document.getElementById('container');

    if (!container) {
      return;
    }

    // noinspection JSSuspiciousNameCombination
    container.scrollLeft += event.deltaY;
  }

  openModalNewAd(): void {
    this.modalCreateNewAd = this.modalService.open(ModalNewAdComponent, {
      modalClass: 'modal-xl',
      ignoreBackdropClick: true
    });

    this.modalCreateNewAd.onClose.subscribe(newAd => {
      console.log({newAd});
      if (!newAd) {
        return;
      }

      this.anuncios.unshift(newAd);
      this.hayAnuncios = true;
    });
  }
}
