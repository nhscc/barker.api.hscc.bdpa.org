import { AppError, KeyTypeError, makeNamedError } from 'named-app-errors';

export * from 'named-app-errors';

// TODO: update named-app-errors with new paradigm
export { KeyTypeError as InvalidKeyError };

export class ActivityGenerationError extends AppError {
  constructor(message?: string) {
    super(message || 'activity generation failed');
  }
}

makeNamedError(ActivityGenerationError, 'ActivityGenerationError');

// * -- * \\

export class ActivitySimulationError extends AppError {
  constructor(message?: string) {
    super(message || 'activity simulation failed');
  }
}

makeNamedError(ActivitySimulationError, 'ActivitySimulationError');

// * -- * \\

export class InvalidIdError<T = string | number> extends AppError {
  constructor(id?: T) {
    super(
      id
        ? `expected valid ObjectId instance, got "${id}" instead`
        : 'invalid ObjectId encountered'
    );
  }
}

makeNamedError(InvalidIdError, 'InvalidIdError');
