import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GimnasioService} from '../../_services/gimnasio.service';
import {Gimnasio} from '../../_models/gimnasio';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorsExtension} from '../../_helpers/validators-extension';
import {MdbModalRef, MdbModalService} from 'mdb-angular-ui-kit';
import {ModalChangePassComponent} from '../../_components/modal-change-pass/modal-change-pass.component';
import {ModalChangeEmailComponent} from '../../_components/modal-change-email/modal-change-email.component';
import {ErrorService} from '../../_services/error.service';

@Component({
  selector: 'app-gimnasio-home',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MisDatosComponent implements OnInit {

  gimnasio!: Gimnasio;
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

    this.updateForm = this.fb.group({
      // Valores que no son actualizables por el formulario
      userName: [this.gimnasio.userName],
      email: [this.gimnasio.email],
      identificador: [this.gimnasio.identificador],
      // Valores que se podrán actualizar en el momento con el formulario
      nombre: [this.gimnasio.nombre, Validators.required],
      cif: [this.gimnasio.cif, [Validators.required, ValidatorsExtension.mustBeAValidCif]],
      direccion: [this.gimnasio.direccion, Validators.required],
      tarifa: [this.gimnasio.tarifa, [Validators.required, Validators.min(1), Validators.max(999)]],
      descripcion: [this.gimnasio.descripcion, Validators.required]
    }, {
      updateOn: 'submit'
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

    }
  }
}
