import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  static errors: { [key: string]: string } = {};

  constructor() {
  }

  static addError(error: { [key: string]: Array<string> }): void {
    for (const [key, value] of Object.entries(error)) {
      const keyInCamelCase = key.charAt(0).toLowerCase() + key.slice(1);
      this.errors[keyInCamelCase] = value[0];
    }
  }

  static clean(): void {
    this.errors = {};
  }

  static show(form: FormGroup): void {
    if (this.errors === null) {
      return;
    }

    for (const [key, value] of Object.entries(this.errors)) {
      form.get(key)?.setErrors({formServer: true});
      // Usar setTimeout nos garantiza que se haya terminado de renderizar el DOM con los *ngif
      setTimeout(() => {
        const element = document.getElementById(`${key}-error`);
        element && (element.innerHTML = value);
      } , 0);
    }
  }

}
