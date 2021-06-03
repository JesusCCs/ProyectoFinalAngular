import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Anuncio} from '../../_models/anuncio';
import {GimnasioService} from '../../_services/gimnasio.service';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit';
import {ModalNewAdComponent} from '../../_components/modal-new-ad/modal-new-ad.component';
import {AnuncioService} from '../../_services/anuncio.service';
import {DomSanitizer} from '@angular/platform-browser';

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
              private anuncioService: AnuncioService,
              private modalService: MdbModalService,
              private sanitizer: DomSanitizer) {
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

  async desactivar(event: MouseEvent): Promise<void> {
    const el = event.target as HTMLAnchorElement;

    await this.anuncioService.desactivar(el.id);

    this.anuncios.find(anuncio => anuncio.id === el.id)!.activo = false;
  }

  resetVideo(event: Event): void {
    const el = event.target as HTMLVideoElement;
    el.load();
  }
}
