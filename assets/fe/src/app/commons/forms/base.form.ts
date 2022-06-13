import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { objectToFormData } from '../utils/helper.util';

export interface DisplayErrorOptions {
  label?: string
  keyValue?: string
}


class FormError {
  #error: string;
  #status: string;

  constructor() {
    this.#error = "";
    this.#status = "";
  }

  get error() {
    return this.#error;
  }

  set error(err: string) {
    this.#error = err;
  }

  get httpstat() {
    return this.#status;
  }

  set httpstat(http: string) {
    this.#status = http;
  }

}

export class Form extends FormError {
  #form: FormGroup;
  nonFieldErrors!: string;
  fb: FormBuilder;
  constructor(
    fields: Object
  ) {
    super()
    this.fb = new FormBuilder();
    this.#form = this.fb.group(fields);
  }

  get form() {
    return this.#form;
  }

  get isValid(): boolean {
    return this.#form.valid;
  }

  valid(f: string) {
    return !(!this.#form.get(f)?.valid && this.#form.get(f)?.touched);
  }

  hasError(f: string, e: string) {
    return this.#form.get(f)?.touched && this.#form.get(f)?.hasError(e);
  }

  getErrorMsg(f: string, e="error") {
    return (this.#form.get(f) as any).errors['error'];
  }
  

  getErrMsgByKey(key: string, options?: DisplayErrorOptions) {
    let { label="This", keyValue="" } = {...options}
    const formControl = this.#form.get(key);

    if (key === "email") {
      label = "Email"
    }
    
    if (["minlength", "maxlength"].includes(key)) {
      keyValue = keyValue || formControl?.errors?.[key]?.requiredLength 
    } else {
      keyValue = keyValue || formControl?.errors?.[key]?.keyValue 
    }

    // @ts-ignore
    const serverErrors = formControl?.errors?.error
    
    // @ts-ignore
    const errMsg: {[key: string]: any} = {
      "minlength": "Minimum of %keyValue% characters",
      "maxlength": "Maximum of %keyValue% characters",
      "maxword": "Maximum of %keyValue% words",
      "minword": "Minium of %keyValue% words",
      "required": "%label% is required",
      "email": "%label% is not valid",
      "match": "%label% must be match to %keyValue%",
      "field_null": "The %keyValue% must not empty",
      "alpha_num": "%label% must contain numbers and letters only",
      "common": "%label% is too common",
      "error": (serverErrors && serverErrors[0]) || "%label% is invalid",
      // Add More error messages if it does not exist

    }[key] || "%label% is invalid" // Get the first error message... 

    // @ts-ignore
    return errMsg.replace("%label%",label).replace("%keyValue%",keyValue)

  }
  displayError(key: string, options?:DisplayErrorOptions): string[] | string { 

    const formControl = this.#form.get(key);
    const keys = Object.keys(formControl?.errors || {})

    if (!formControl?.touched || keys.length === 0) return "";
    return this.getErrMsgByKey(keys[0],options)
  }

  // displayListError(key: string, options?:DisplayErrorOptions): string[] | null { 
  //   const formControl = this.#form.get(key);
  //   const keys = Object.keys(formControl?.errors || {})
  //   if (!formControl?.touched || keys.length === 0) return null;

  //   return keys.map((key)=> this.getErrMsgByKey(key,options))
  // }

  /* SET BACKEND ERRORS
   * use this to set errors that came from the backend
   */
  setFormErrors(errors: {[key: string]: any}): void {
    for (let [key, value] of Object.entries(errors)) {
      const control = this.#form.get(key);
      if(control) control.setErrors({'error': value});
    }
    if('non_field_errors' in errors) {
      this.nonFieldErrors = (errors['non_field_errors'] as []).toString();
    }
  }

  /* AUTO VALIDATE
   * force the field to trigger validation
   */
  validate(key: string): void {
    const f = (this.#form.get(key) as any);
    f.markAsTouched(); f.markAsDirty(); f.updateValueAndValidity();
  }


  // Custom valud

  get formDataValue(){
    return objectToFormData(this.form.value)
  }

}