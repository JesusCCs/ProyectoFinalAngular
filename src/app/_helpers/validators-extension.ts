import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Clase que posee todos los métodos de las validaciones propias
 */
export class ValidatorsExtension {

  /**
   * Comprueba que dos campos tienen el mismo valor. Útil para los campos de Contraseña y Repetir Contraseña
   * @param firstToMatch El nombre del primer campo
   * @param secondToMatch El nombre del segundo campo
   */
  public static match(firstToMatch: string, secondToMatch: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;

      const inputToMatch = form.get(firstToMatch);
      const anotherInputToMatch = form.get(secondToMatch);

      if (!inputToMatch?.value || !anotherInputToMatch?.value) {
        return null;
      }


      if (inputToMatch?.value !== anotherInputToMatch?.value) {
        inputToMatch?.setErrors({inputMismatch: true});
        anotherInputToMatch?.setErrors({inputMismatch: true});

        inputToMatch?.markAsTouched();
        anotherInputToMatch?.markAsTouched();

        return {inputMismatch: true};
      }

      inputToMatch?.setErrors(null);
      anotherInputToMatch?.setErrors(null);

      return null;
    };
  }

  /**
   * La validación de CIF está adaptado a Typescript a partir del script de la siguiente página:
   * https://www.lawebdelprogramador.com/codigo/JavaScript/1992-Validar-un-CIF-NIF-y-DNI.html
   */
  public static mustBeAValidCif(control: AbstractControl): ValidationErrors | null {
    if (!validarCif(control.value)) {
      return {invalidCif: true};
    }

    return null;

    function validarCif(cif: string): boolean {
      // Quitamos el primer caracter y el ultimo digito
      const valueCif = cif.substr(1, cif.length - 2);

      // Sumamos las cifras pares de la cadena
      let sumaPar = 0;
      for (let i = 1; i < valueCif.length; i += 2) {
        sumaPar += parseInt(valueCif.substr(i, 1), 10);
      }

      // Sumamos las cifras impares de la cadena
      let sumaImpar = 0;
      let result = 0;
      for (let i = 0; i < valueCif.length; i += 2) {
        result = parseInt(valueCif.substr(i, 1), 10) * 2;
        sumaImpar += result.toString().length === 1 ? parseInt(result.toString(), 10) :
          parseInt(result.toString().substr(0, 1), 10) + parseInt(result.toString().substr(1, 1), 10);
      }

      // Sumamos las dos sumas que hemos realizado
      const suma = sumaPar + sumaImpar;

      const unidad = suma > 9 ? String(suma).substr(1, 1) : String(suma);
      let unidadCalculada = 10 - parseInt(unidad, 10);

      const primerCaracter = cif.substr(0, 1).toUpperCase();
      const lastchar = cif.substr(cif.length - 1, 1);
      const lastcharchar = !Number.isInteger(lastchar) ? lastchar : String.fromCharCode(64 + parseInt(lastchar, 10));

      if (primerCaracter.match(/^[FJKNPQRSUVW]$/)) {
        // Empieza por .... Comparamos la ultima letra
        if (String.fromCharCode(64 + unidadCalculada).toUpperCase() === lastcharchar) {
          return true;
        }
      } else if (primerCaracter.match(/^[XYZ]$/)) {
        // Se valida como un dni
        let newcif = '';
        if (primerCaracter == 'X') {
          newcif = cif.substr(1);
        } else if (primerCaracter == 'Y') {
          newcif = '1' + cif.substr(1);
        } else if (primerCaracter == 'Z') {
          newcif = '2' + cif.substr(1);
        }

        return validarNIF(newcif);
      } else if (primerCaracter.match(/^[ABCDEFGHLM]$/)) {
        // Se revisa que el ultimo valor coincida con el calculo
        if (unidadCalculada === 10) {
          unidadCalculada = 0;
        }

        if (cif.substr(cif.length - 1, 1) === unidadCalculada.toString()) {
          return true;
        }
      } else {
        // Se valida como un dni
        return validarNIF(cif);
      }

      return false;
    }

    function validarNIF(dni: string): boolean {
      const letters = 'TRWAGMYFPDXBNJZSQVHLCKET';
      const patternDNI = /^[XYZ]?\d{5,8}[A-Z]$/;
      dni = dni.toUpperCase();

      if (!patternDNI.test(dni)) {
        return false;
      }

      let num: any = dni.substr(0, dni.length - 1)
        .replace('X', '0')
        .replace('Y', '1')
        .replace('Z', '2');
      num %= 23;

      const letter: string = dni.substr(dni.length - 1, 1);
      const calculatedLetter: string = letters.substring(num, num + 1);

      return letter === calculatedLetter;
    }
  }

  /**
   * Comprueba que el input de la fecha final es superior o igual al de la fecha inicial escogida
   * @param initialDateInput Nombre en el formulario del input que contiene la fecha inicial
   * @param finalDateInput Nombre en el formulario del input que contiene la fecha final
   */
  public static datesCoherent(initialDateInput: string, finalDateInput: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;

      const initial = form.get(initialDateInput);
      const final = form.get(finalDateInput);

      if (!initial?.value || !final?.value) {
        return null;
      }

      const initialDate = initial.value as Date;
      const finalDate = final.value as Date;


      if (initialDate > finalDate) {
        initial?.setErrors({datesNotValid: true});
        final?.setErrors({datesNotValid: true});

        initial?.markAsTouched();
        final?.markAsTouched();

        return {datesNotValid: true};
      }

      initial?.setErrors(null);
      final?.setErrors(null);

      return null;
    };
  }
}
