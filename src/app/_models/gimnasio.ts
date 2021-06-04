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

  /**
   * A partir del formulario, añadimos listeners a todos los campos cuyo nombre coincida
   * con los nombres de las propiedades de esta clase. De forma que si el input cambia su valor, también
   * lo harán los estados de nuestro modelo.
   *
   * Esto se hace así para mostrar como quedaría lo
   * que escribimos en los campos con lo que se vería en la app móvil
   *
   * @param updateForm El formulario a controlar
   */
  bind(updateForm: FormGroup): void {
    for (const controlsKey in updateForm.controls) {
      if (!this.hasOwnProperty(controlsKey)) {
        continue;
      }

      updateForm.get(controlsKey)?.valueChanges.subscribe(value => {
        this[controlsKey] = value;
      });
    }
  }

  /**
   * Llamada a init, pero debido a que se usa en un reseteo de formulario, se le aplica este wrapper para que semánticamente
   * se más correcto
   * @param obj El objeto con el que iniciar de nuevo los campos del modelo
   */
  reset(obj: Gimnasio): void {
    this.init(obj);
  }

  /**
   * Iniciamos las variables a partir de un objet
   * @param obj El objeto con el que iniciar
   */
  init(obj: Gimnasio): void {
    this.identificador = obj.identificador;
    this.nombre = obj.nombre;
    this.direccion = obj.direccion;
    this.descripcion = obj.descripcion;
    this.tarifa = obj.tarifa;
    this.logo = obj.logo;
  }
}
