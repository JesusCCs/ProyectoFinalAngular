import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GimnasioService} from '../../_services/gimnasio.service';
import {Gimnasio, GimnasioVistaPrevia} from '../../_models/gimnasio';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit';
import {ModalChangePassComponent} from '../../_components/modal-change-pass/modal-change-pass.component';
import {ModalChangeEmailComponent} from '../../_components/modal-change-email/modal-change-email.component';
import {ErrorService} from '../../_services/error.service';
import {Toast} from '../../_models/toast';

@Component({
  selector: 'app-gimnasio-home',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MisDatosComponent implements OnInit {

  gimnasio!: Gimnasio;
  gimnasioPrevia!: GimnasioVistaPrevia;

  updateForm!: FormGroup;

  modalPass!: MdbModalRef<ModalChangePassComponent>;
  modalEmail!: MdbModalRef<ModalChangeEmailComponent>;

  file: File | null = null;

  constructor(private gimnasioService: GimnasioService,
              private modalService: MdbModalService,
              private fb: FormBuilder) {
  }

  async ngOnInit(): Promise<void> {
    this.gimnasio = await this.gimnasioService.findById();
    this.gimnasioPrevia = new GimnasioVistaPrevia(this.gimnasio);

    this.updateForm = this.fb.group({
      // Valores que no son actualizables por el formulario
      userName: [this.gimnasio.userName],
      email: [this.gimnasio.email],
      identificador: [this.gimnasio.identificador],
      // Valores que se podrán actualizar en el momento con el formulario
      nombre: [this.gimnasio.nombre, Validators.required],
      cif: [this.gimnasio.cif, [Validators.required, ValidatorsExtension.mustBeAValidCif]],
      direccion: [this.gimnasio.direccion, Validators.required],
      tarifa: [this.gimnasio.tarifa, [Validators.required, Validators.min(1), Validators.max(99)]],
      descripcion: [this.gimnasio.descripcion, Validators.required]
    }, {
      updateOn: 'change'
    });

    this.gimnasioPrevia.bind(this.updateForm);
  }

  openFileSelector(): void {
    document.getElementById('uploader')?.click();
  }

  uploadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files === null) {
      return;
    }

    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(files[0].type)) {
      Toast.fire({
        icon: 'error',
        title: 'Extensión de archivo no permitida'
      });
      return;
    }

    this.file = files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.gimnasioPrevia.logo = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  public async onSubmit(): Promise<void> {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    ErrorService.clean();

    const inputs = this.updateForm.value;

    const resultado: boolean = await this.gimnasioService.update(inputs, this.file);

    if (!resultado) {
      ErrorService.showInForm(this.updateForm);
    } else {
      Toast.fire({
        icon: 'success',
        title: 'Datos actualizados'
      }).then(_ => 0);
    }
  }

  public onReset(): void {
    this.gimnasioPrevia.reset(this.gimnasio);
    this.updateForm.patchValue({
      nombre: this.gimnasio.nombre,
      cif: this.gimnasio.cif,
      direccion: this.gimnasio.direccion,
      tarifa: this.gimnasio.tarifa,
      descripcion: this.gimnasio.descripcion
    });
  }

  openModalPass(): void {
    this.modalPass = this.modalService.open(ModalChangePassComponent, {
      modalClass: 'modal-dialog-centered'
    });
  }

  openModalEmail(): void {
    this.modalEmail = this.modalService.open(ModalChangeEmailComponent, {
      modalClass: 'modal-dialog-centered'
    });
  }

}
