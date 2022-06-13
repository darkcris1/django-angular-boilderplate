import { FormControl, Validators } from '@angular/forms';
import { Form } from './base.form';
import { isPassCommon, matcher } from './base.validators';

const pwdValidators = [
  Validators.required,
  Validators.min(8),
  isPassCommon
]

export class LoginForm extends Form {
  
  constructor() {
    const fields: any = {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, pwdValidators),
    }
    super(fields);
  }

}

export class SignupForm extends Form {

  constructor() {

    const fields: any = {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      photo: new FormControl(null, [Validators.required]),
    }
    super(fields);
  }

}

export class ForgotPasswordForm extends Form {
  constructor() {
    const fields: any = {
      email: new FormControl(null, [Validators.required, Validators.email]),
    }
    super(fields);
  }
}
export class ResetPassword extends Form {
  constructor() {
    const fields: any = {
      new_password: new FormControl(null,pwdValidators),
      code: new FormControl(null,[Validators.required]),
      confirm_new_password: new FormControl(null,[Validators.required, matcher()]),
    }
    super(fields);
  }
}

