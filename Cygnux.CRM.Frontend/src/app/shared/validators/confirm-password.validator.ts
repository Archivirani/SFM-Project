import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  let rValue =
    control.value.password === control.value.confirmPassword
      ? null
      : { PasswordNoMatch: true };
  console.log(control);
  return rValue;
};
