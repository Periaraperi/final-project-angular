import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from "@angular/forms";

export function passwordValidation(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passGroup = control as FormGroup;
    const pass1 = passGroup.get('pass1');
    const pass2 = passGroup.get('pass2');
    if (pass1!==null && pass2!==null && pass1.value===pass2.value) {
      return null;
    }

    pass2?.setErrors({passwordMismatch: true});
    return {passwordMismatch: true};
  };
}
