import PasswordValidator from 'password-validator';
import config from '../misc/config';

interface ValidationResult {
  success: boolean;
  message: string[];
}

interface PasswordValidatorResult {
  validation: string;
  message: string;
  arguments?: number;
}

const passwordValidator = new PasswordValidator();
passwordValidator
  .is()
  .min(config.authentication.password.minLength)
  .is()
  .max(config.authentication.password.maxLength)
  .is()
  .not()
  .oneOf(config.authentication.password.blacklist);

if (config.authentication.password.requiredMinDigits > 0) {
  passwordValidator.has().digits(config.authentication.password.requiredMinDigits);
}
if (config.authentication.password.requireLowercase) {
  passwordValidator.has().lowercase();
}
if (config.authentication.password.requireUppercase) {
  passwordValidator.has().uppercase();
}
if (!config.authentication.password.allowSpaces) {
  passwordValidator.has().not().spaces();
}

export function validateUser(user?: string): ValidationResult {
  const result: ValidationResult = {
    success: true,
    message: [],
  };

  if (!user) {
    result.success = false;
    result.message.push('no user provided');
    return result;
  }
  if (user.length < config.authentication.user.minLength) {
    result.success = false;
    result.message.push(`user to short, min length ${config.authentication.user.minLength} characters`);
  }
  if (user.length > config.authentication.user.maxLength) {
    result.success = false;
    result.message.push(`user to long, max length ${config.authentication.user.maxLength} characters`);
  }

  return result;
}

export function validatePassword(password?: string): ValidationResult {
  const result: ValidationResult = {
    success: false,
    message: [],
  };

  if (!password) {
    result.success = false;
    result.message.push('no password provided');
    return result;
  }

  const validationResult = passwordValidator.validate(password, { details: true }) as PasswordValidatorResult[];

  if (validationResult.length <= 0) {
    result.success = true;
    return result;
  }

  validationResult.forEach((validationError) => {
    switch (validationError.validation) {
      case 'min': {
        result.message.push(`password to short, min length ${config.authentication.password.minLength} characters`);
        break;
      }
      case 'max': {
        result.message.push(`password to long, max length ${config.authentication.password.maxLength} characters`);
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
        result.message.push(`password requires at least ${config.authentication.password.requiredMinDigits} digits`);
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
