import { AppError, makeNamedError } from 'named-app-errors';

export * from 'named-app-errors';

export class ActivityGenerationError extends AppError {
  constructor(message?: string) {
    super(message || 'an unknown error occurred');
  }
}

makeNamedError(ActivityGenerationError, 'ActivityGenerationError');

export class IdTypeError<T = string | number> extends AppError {
  constructor(id?: T) {
    super(
      id
        ? `expected valid ObjectId instance, got "${id}" instead`
        : 'invalid ObjectId encountered'
    );
  }
}

makeNamedError(IdTypeError, 'IdTypeError');
