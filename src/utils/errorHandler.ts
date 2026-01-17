interface ApiErrorResponse {
  status?: number;
  data?: {
    message?: string;
  };
}

interface ApiError extends Error {
  response?: ApiErrorResponse;
}

export class ErrorHandler {
  static handleApiError(error: unknown, fallbackMessage: string): string {
    const typedError = error as ApiError;
    const response = typedError?.response;

    if (response?.data?.message) {
      return response.data.message;
    }

    switch (response?.status) {
      case 401:
        return 'Пожалуйста, войдите в систему';
      case 403:
        return 'У вас нет доступа к этому ресурсу';
      case 404:
        return 'Ресурс не найден';
      case 500:
        return 'Внутренняя ошибка сервера';
      default:
        return fallbackMessage;
    }
  }
}
