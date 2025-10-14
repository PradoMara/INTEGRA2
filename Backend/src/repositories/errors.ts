/**
 * RepositoryError: error tipificado para operaciones de repositorio
 */
export enum RepositoryErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INVALID_PAGINATION = 'INVALID_PAGINATION',
  UNKNOWN = 'UNKNOWN',
}

export interface RepositoryErrorContext {
  action: string;
  cause?: unknown;
  meta?: any;
}

export class RepositoryError extends Error {
  public readonly code: RepositoryErrorCode;
  public readonly context?: RepositoryErrorContext;

  constructor(code: RepositoryErrorCode, message: string, context?: Partial<RepositoryErrorContext>) {
    super(message);
    this.code = code;
    this.context = context as RepositoryErrorContext | undefined;
    this.name = 'RepositoryError';
  }
}
