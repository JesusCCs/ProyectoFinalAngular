import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export class ValidatorsExtension {

  public static match(firstToMatch: string, secondToMatch: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;

      const inputToMatch = form.get(firstToMatch);
      const anotherInputToMatch = form.get(secondToMatch);


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


}
