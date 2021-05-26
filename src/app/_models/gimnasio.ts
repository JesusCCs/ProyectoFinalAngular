import {FormGroup} from '@angular/forms';

export interface Gimnasio {
  id: string;
  identificador: string;
  userName: string;
  email: string;
  cif: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  fechaCreado: string;
  logo: string;
  tarifa: number;
}

export class GimnasioVistaPrevia {

  [k: string]: any;

  identificador!: string;
  nombre!: string;
  direccion!: string;
  descripcion!: string;
  tarifa!: number;
  logo!: string;

  constructor(obj: Gimnasio) {
    this.init(obj);
  }

  bind(updateForm: FormGroup): void {
    for (const controlsKey in updateForm.controls) {
      if (!this.hasOwnProperty(controlsKey)) { continue; }

      updateForm.get(controlsKey)?.valueChanges.subscribe(value => {
        this[controlsKey] = value;
      });
    }
  }

  reset(obj: Gimnasio): void {
    this.init(obj);
  }

  init(obj: Gimnasio): void {
    this.identificador = obj.identificador;
    this.nombre = obj.nombre;
    this.direccion = obj.direccion;
    this.descripcion = obj.descripcion;
    this.tarifa = obj.tarifa;
    this.logo = obj.logo;
  }
}
