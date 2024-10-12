import crypto from 'node:crypto';
import PasswordValidator from 'password-validator';
import bcrypt from 'bcrypt';
import config from '../config';
import { AuthResponseBody } from '../misc/requestAndResponseTypes';

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

function validateUser(user?: string): ValidationResult {
  if (!user) {
    return { success: false, message: ['user required'] };
  }

  const result: ValidationResult = {
    success: true,
    message: [],
  };

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

function validatePassword(password?: string): ValidationResult {
  if (!password) {
    return { success: false, message: ['password required'] };
  }

  const result: ValidationResult = {
    success: false,
    message: [],
  };

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

export function validateUserAndPassword(
  user?: string,
  password?: string,
): { ok: boolean; errorResponse?: AuthResponseBody } {
  const userValidationResult = validateUser(user);
  const passwordValidationResult = validatePassword(password);

  if (!userValidationResult.success || !passwordValidationResult.success) {
    const errorResponse: AuthResponseBody = {};
    if (!userValidationResult.success) {
      errorResponse.userError = userValidationResult.message;
    }
    if (!passwordValidationResult.success) {
      errorResponse.passwordError = passwordValidationResult.message;
    }

    return { ok: false, errorResponse };
  }

  return { ok: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.authentication.password.saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return new Promise((res, rej) => {
    setTimeout(
      async () => {
        try {
          const result = await bcrypt.compare(password, hash);
          res(result);
        } catch (err) {
          console.error('Password comparison failed', err);
          rej(false);
        }
      },
      Math.floor(Math.random() * config.authentication.password.timingAttackProtectionMs),
    );
  });
}

export function generateSecureToken(length: number): string {
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('base64').slice(0, length);
}
