export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }

  static notFound(message = 'Recurso no encontrado'): ApiError {
    return new ApiError(404, message);
  }

  static badRequest(message = 'Solicitud inválida', details?: unknown): ApiError {
    return new ApiError(400, message, details);
  }
}
