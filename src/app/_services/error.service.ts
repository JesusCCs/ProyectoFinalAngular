import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
/**
 * Clase de vital importancia que trabaja junto al interceptor de errores para mostrar adecuadamente las excepciones del servidor
 * al usuario. El interceptador se encarga de averiguar de qué error se trata y formatear una respuesta para seguir pasándola a la aplicación
 *
 * El resto de servicios que tratan sobre llamadas a la api implementan un catch en todas las promesas, de forma que
 * los errores (recordemos que formateados por el interceptor) siempre son capturados y es en esta función donde llaman a los métodos
 * estáticos de esta clase que se encarga de almacenarlos
 */
export abstract class ErrorService {

  /**
   * Aquí es donde guardamos los errores que van llegando
   */
  static errors: { [key: string]: string } = {};

  /**
   * Método estático donde, conociendo como formatea el interceptor los errores, va llenado el estado.
   * Este es el método que todas las promesas en la aplicación llaman en su catch.
   *
   * Hay una sola excepción, y es que si se detecta que los errores pasados por el parámetro uno de ellos tiene la clave de 'general',
   * sabemos que no es un error de un input concreto y se muestra directamente mediante un swal, sin almacenar en ningún lugar. En el
   * resto de casos, es necesario que una vez almacenados se muestren mediante otro método
   *
   * @param error Los errores capturados
   *
   * @see ErrorService.showInForm
   */
  static addError(error: { [key: string]: Array<string> }): void {
    if (error.general) {
      Swal.fire('¡Error!', error.general[0], 'error');
      return;
    }

    for (const [key, value] of Object.entries(error)) {
      if (key === '') {
        Swal.fire('¡Error!', error[key][0], 'error');
        return;
      }

      const keyInCamelCase = key.charAt(0).toLowerCase() + key.slice(1);
      this.errors[keyInCamelCase] = value[0];
    }
  }

  /**
   * Debido a que es una clase sin instancias, solo con métodos estáticos, es necesario hacer limpieza de los errores antes de
   * hacer nuevas peticiones, pues podría darse el caso de interferencias
   */
  static clean(): void {
    this.errors = {};
  }

  /**
   * Una vez que se tiene almacenado el error, es necesario mostrarlo. Tras conocer que la respuesta ha sido inválida, se llama
   * a este método y se le pasa el formulario que tiene los campos donde uno de ellos ha podido pasar.
   *
   * Para poder hacerlo genérico, se ha realizado lo siguiente:
   * - En la variable errors se tiene almacenado un objeto cuya clave es el nombre del parámetro que ha fallado y su valor el mensaje
   * - Los campos en el formulario están nombrados de la misma forma que los DTOs en la API, luego si la API detecta un error en
   *   el campo Identificador, sabemos que el error viene de un input nombrado identificador en su formulario
   * - Los errores que se encuentran escondidos por un *ngif tienen un id que sigue el patrón {nombreInput}-id.
   *
   * Con lo anterior, podemos localizar de forma sencilla el input que ha fallado, setearle que tiene un error, y tras esto conseguir
   * el tag (mediante su id) donde hay que inyectar el mensaje de error.
   *
   * @param form
   *
   * @see ErrorService.addError
   */
  static showInForm(form: FormGroup): void {
    for (const [key, value] of Object.entries(this.errors)) {
      form.get(key)?.setErrors({formServer: true});

      // Usar setTimeout nos garantiza que se haya terminado de renderizar el DOM con los *ngif
      setTimeout(() => {
        const element = document.getElementById(`${key}-error`);
        return element && (element.innerHTML = value);
      }, 0);
    }
  }

}
