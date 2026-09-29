import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ApiError } from '../lib/errors';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Datos inválidos', details: err.flatten() });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: 'Datos inválidos', details: err.errors });
    return;
  }

  // Índice único duplicado (p. ej. producto ya existe, o ya está en el carrito)
  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'El recurso ya existe (violación de índice único)' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
