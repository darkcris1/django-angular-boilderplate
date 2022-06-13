import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const matcher = (match="new_password") => {
  return (control: any): ValidationErrors | null => {

    if (control.parent) {
      const new_password = control.parent.controls[match].value;

      if (
        new_password &&
        new_password !== control.value
      ) {
        return { match: {keyValue: match }};
      }

      return null;
    }
    return null;
  }
}

export const fieldNull = (target = "current_password") => {
  return (control: any ): ValidationErrors | null => {
    if (control.parent) {
      const targetValue = control.parent?.controls[target]?.value;
      // current password value should not be null
      // when the new_password field has value.
      if (control.value) {
        return targetValue ? null: { field_null: {keyValue: target}};
      }
    }
    return null;
  }
}

export const isPassCommon = (control: any ): ValidationErrors | null => {
    const iscommon =  ["12345678","123456789"].includes(control.value || "");

    return iscommon ? {common: true} : null
}





// https://gist.github.com/brianroadifer/b4798a71dd6af15f6b11b7f6b36ece19
export class WordValidator {
  private static seperator = /\s+/gmu;

  static min(min: number, seperator: string | RegExp = WordValidator.seperator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Check that the control has a value and if that value is a string.
      if (control.value && typeof control.value === 'string') {
        // Remove any leading and trailing whitespace
        const value = control.value.trim();
        const words = value.split(seperator);
        const actual = words.length;
        if (actual < min) {
          return { minword: { keyValue: min, actual } };
        }
      }
      return null;
    };
  }

  static max(max: number, seperator: string | RegExp = WordValidator.seperator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Check that the control has a value and if that value is a string.
      if (control.value && typeof control.value === 'string') {
        // Remove any leading and trailing whitespace.
        const value = control.value.trim();
        const words = value.split(seperator);
        const actual = words.length;
        if (actual > max) {
          return { maxword: { keyValue: max, actual } };
        }
      }
      return null;
    };
  }
}