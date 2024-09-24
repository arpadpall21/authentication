import PasswordValidator from 'password-validator';
import { AuthResponse } from '../routes/authentication';

interface PasswordValidationResult extends AuthResponse {}

interface PasswordValidatorResult {
  validation: string;
  message: string;
  arguments?: number;
}

const passwordValidator = new PasswordValidator();
passwordValidator
  .is().min(8)
  .is().max(45)
  .has().uppercase()
  .has().lowercase()
  .has().digits(2)
  .has().not().spaces()
  .is().not().oneOf(['Passw0rd', 'Password123']);

export function validatePassword(password: string): PasswordValidationResult {
  const result: PasswordValidationResult = {
    success: true,
    message: '',
  };

  const validationResult = passwordValidator.validate(password, { details: true }) as PasswordValidatorResult[];

  if (validationResult.length <= 0) {
    return result;
  }

  console.log('*********************')
  validationResult.forEach((validationError) => {
    console.log(validationError)
  })

  return result;
}


const testPassword = 'test'

console.log('----------------------------------')
console.log(validatePassword(testPassword))