import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GimnasioService} from '../../_services/gimnasio.service';
import {Gimnasio} from '../../_models/gimnasio';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorsExtension} from '../../_helpers/validators-extension';

@Component({
  selector: 'app-gimnasio-home',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MisDatosComponent implements OnInit {

  page = 'mis-datos';
  type = 'gimnasio';

  gimnasio!: Gimnasio;

  updateForm!: FormGroup;

  constructor(private gimnasioService: GimnasioService,
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

  get f(): { [p: string]: AbstractControl } {
    return this.updateForm.controls;
  }

}
