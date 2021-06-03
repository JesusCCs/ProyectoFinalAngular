import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MdbModalRef} from 'mdb-angular-ui-kit';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {STEPPER_GLOBAL_OPTIONS, StepperOrientation} from '@angular/cdk/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AnuncioService} from '../../_services/anuncio.service';
import {ErrorService} from '../../_services/error.service';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import {DateLocalizationProvider} from '../../_helpers/dates';
import {Moment} from 'moment/moment';
import {MatStepper} from '@angular/material/stepper';


@Component({
  selector: 'app-modal-new-ad',
  templateUrl: './modal-new-ad.component.html',
  styleUrls: ['./modal-new-ad.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
    DateLocalizationProvider
  ],
})
export class ModalNewAdComponent implements OnInit, AfterViewInit {

  /**
   * El identificador del anuncio que estamos creando. Se carga en memoria porque el formulario
   * es por partes
   */
  anuncioId: string | null = null;

  /**
   * Bandera para controlar si estamos en mitad de una llamada ajax o no y así mostrar un spinner de carga
   */
  loading = false;

  /**
   * Bandera para sabe si el anuncio se ha creado con éxito y está terminado
   */
  finished = false;

  /**
   * Referencia al formulario por partes, para poder avanzar al siguiente paso del formulario
   * @private
   */
  @ViewChild('stepper') private stepper!: MatStepper;

  stepperOrientation: Observable<StepperOrientation>;

  // ESTADOS FORMULARIO DE SUBIDA DE FICHERO
  fileForm!: FormGroup;
  inputElement!: HTMLInputElement;
  fileName: string | null = null;

  // ESTADOS FORMULARIO DE SUBIDA DE DETALLES
  detailsForm!: FormGroup;


  constructor(public modalRef: MdbModalRef<ModalNewAdComponent>,
              private fb: FormBuilder,
              private anuncioService: AnuncioService,
              private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
  }


  ngOnInit(): void {
    this.fileForm = this.fb.group({
      recurso: [null, Validators.required],
      recursoInput: ['', Validators.required]
    }, {updateOn: 'submit'});

    this.detailsForm = this.fb.group({
      inicio: [null, Validators.required],
      fin: ['', Validators.required],
      reproduccionesLimite: ['', Validators.required]
    }, {
      validators: ValidatorsExtension.datesCoherent('inicio', 'fin'),
      updateOn: 'change'
    });
  }

  ngAfterViewInit(): void {
    this.inputElement = document.getElementById('upload-input') as HTMLInputElement;
  }

  clickUpload(): void {
    if (this.loading) {
      return;
    }
    document.getElementById('recurso')?.click();
  }

  async uploadFile(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;

    if (files === null) {
      return;
    }

    const file = files[0];

    this.inputElement.value = file.name;

    this.loading = true;
    const resultado = this.anuncioId ?
      await this.anuncioService.updateFile(this.anuncioId, file) :
      await this.anuncioService.create(file);
    this.loading = false;

    if (!resultado) {
      this.fileForm.markAllAsTouched();
      ErrorService.showInForm(this.fileForm);
      this.inputElement.value = this.fileName ? this.fileName : '';
      return;
    }

    this.fileForm.get('recursoInput')?.setErrors(null);
    this.fileForm.get('recurso')?.setErrors(null);

    this.anuncioId = resultado;
    this.fileName = file.name;
  }

  async updateDetails(): Promise<void> {
    if (!this.anuncioId) {
      return;
    }

    const iniM = this.get('inicio')?.value as Moment;
    const finM = this.get('fin')?.value as Moment;

    const inicio = iniM.format('YYYY-MM-DD');
    const fin = finM.format('YYYY-MM-DD');
    const reproduccionesLimite = this.get('reproduccionesLimite')?.value;

    this.loading = true;
    await this.anuncioService.updateDetails(this.anuncioId, { reproduccionesLimite, inicio, fin } );
    this.loading = false;

    this.finished = true;

    this.nextStep();
  }

  async confirm(): Promise<void> {
    if (!this.anuncioId) {
      return;
    }

    const anuncio = await this.anuncioService.setStatus(this.anuncioId, true);
    this.modalRef.close(anuncio);
  }

  async cancel(): Promise<void> {
    if (this.anuncioId) {
      await this.anuncioService.setStatus(this.anuncioId, false);
    }

    this.modalRef.close();
  }

  checkValidityForms(): void {
    if (this.fileForm.invalid) {
      this.fileForm.markAllAsTouched();
      return;
    }
  }

  async checkValidityDates(): Promise<void> {
    const inicio = this.get('inicio')?.value as Moment;
    const fin = this.get('fin')?.value as Moment;

    if (!inicio || !fin) {
      return;
    }

    const fechaInicio = inicio.format('YYYY-MM-DD');
    const fechaFin = fin.format('YYYY-MM-DD');

    if (fin.isBefore(inicio)) {
      return;
    }

    const validas = await this.anuncioService.checkDates(fechaInicio, fechaFin);

    this.get('inicio')?.setErrors(validas ? null : {rangeInUse: true});
    this.get('fin')?.setErrors(validas ? null : {rangeInUse: true});
  }

  get errorsInUpload(): false | ValidationErrors | null | undefined {
    return (this.get('recurso')?.touched && this.get('recurso')?.errors) ||
      (this.get('recursoInput')?.touched && this.get('recursoInput')?.errors);
  }

  get errorsInDates(): false | ValidationErrors | null | undefined {
    return (this.get('inicio')?.touched && this.get('inicio')?.errors) ||
      (this.get('fin')?.touched && this.get('fin')?.errors);
  }

  get(element: string): AbstractControl | null {
    const el = this.fileForm.get(element);

    if (el != null) {
      return el;
    }

    return this.detailsForm.get(element);
  }

  nextStep(): void {
    this.stepper.next();
  }


}
