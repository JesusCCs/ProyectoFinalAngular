import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {STEPPER_GLOBAL_OPTIONS, StepperOrientation} from '@angular/cdk/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AnuncioService} from '../../_services/anuncio.service';
import {ErrorService} from '../../_services/error.service';

@Component({
  selector: 'app-modal-new-ad',
  templateUrl: './modal-new-ad.component.html',
  styleUrls: ['./modal-new-ad.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }],
})
export class ModalNewAdComponent implements OnInit, AfterViewInit {

  stepperOrientation: Observable<StepperOrientation>;

  fileForm!: FormGroup;
  inputElement!: HTMLInputElement;
  fileElement!: HTMLInputElement;

  detailsForm!: FormGroup;
  doneForm!: FormGroup;

  /**
   * El identificador del anuncio que estamos creando. Se carga en memoria porque el formulario
   * es por partes
   */
  anuncioId: string | null = null;

  loading = false;

  finished = false;

  constructor(public modalRef: MdbModalRef<ModalNewAdComponent>,
              private fb: FormBuilder,
              private anuncioService: AnuncioService,
              private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
  }


  ngOnInit(): void {
    this.fileForm = this.fb.group({
      recurso: [null, Validators.required]
    }, {updateOn: 'submit'});

    this.detailsForm = this.fb.group({});

    this.doneForm = this.fb.group({});
  }

  ngAfterViewInit(): void {
    this.inputElement = document.getElementById('upload-input') as HTMLInputElement;
    this.fileElement = document.getElementById('recurso') as HTMLInputElement;
  }

  async uploadFile(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;

    if (files === null) {
      return;
    }

    const file = files[0];

    this.inputElement.value = file.name;
    this.loading = true;

    const resultado = await this.anuncioService.create(file);

    this.loading = false;

    if (!resultado) {
      this.fileForm.markAllAsTouched();
      ErrorService.showInForm(this.fileForm);
      return;
    }

    this.anuncioId = resultado;
  }

  clickUpload(): void {
    if (this.loading) {
      return;
    }
    document.getElementById('recurso')?.click();
  }

  checkValidity(event: MouseEvent): void {
    if (this.fileForm.invalid) {
      this.fileForm.markAllAsTouched();
      return;
    }
  }
}
