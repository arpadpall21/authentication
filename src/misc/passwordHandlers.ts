import PasswordValidator from 'password-validator';

interface PasswordValidationResult {
  success: boolean;
  message: string[];
}

interface ValidatorResult {
  validation: string;
  message: string;
  arguments?: number;
}

const passwordValidator = new PasswordValidator();
passwordValidator
  .is().min(8)
  .is().max(15)
  .has().uppercase()
  .has().lowercase()
  .has().digits(2)
  .has().not().spaces()
  .is().not().oneOf(['Passw0rd', 'Password123']);

export function validatePassword(password: string): PasswordValidationResult {
  const result: PasswordValidationResult = {
    success: false,
    message: [],
  };

  const validationResult = passwordValidator.validate(password, { details: true }) as ValidatorResult[];

  if (validationResult.length <= 0) {
    result.success = true;
    return result;
  }

  validationResult.forEach((validationError) => {
    switch (validationError.validation) {
      case 'min': {
        result.message.push(`password to short, min length ${8} characters`);
        break;
      }
      case 'max': {
        result.message.push(`password to long, max length ${45} characters`);
        break;
      }
      case 'uppercase': {
        result.message.push("password doesn't have any uppercase charaters");
        break;
      }
      case 'lowercase': {
        result.message.push("password doesn't have any lowercase charaters");
        break;
      }
      case 'digits': {
        result.message.push(`password requires at least ${2} digits`);
        break;
      }
      case 'spaces': {
        result.message.push('password cannot contain any spaces');
        break;
      }
      case 'oneOf': {
        result.message.push('password blacklisted');
        break;
      }
      default: {
        result.message.push(`password invalid: ${validationError.validation}`);
      }
    }
  });

  return result;
}


const testPassword = 'Passw0rd'

console.log('----------------------------------')
console.log(validatePassword(testPassword))