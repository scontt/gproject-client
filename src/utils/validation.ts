export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export class FormValidator {
  static validateUsername(username: string): ValidationResult {
    if (username.length < 5 || !usernameRegex.test(username)) {
      return {
        isValid: false,
        message: 'Никнейм: минимум 5 символов, только буквы, цифры, ., _, -',
      };
    }

    return { isValid: true };
  }

  static validatePassword(password: string): ValidationResult {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Пароль должен содержать минимум 6 символов',
      };
    }

    return { isValid: true };
  }

  static validatePasswordMatch(password: string, confirmation: string): ValidationResult {
    if (password !== confirmation) {
      return {
        isValid: false,
        message: 'Пароли не совпадают',
      };
    }

    return { isValid: true };
  }
}
