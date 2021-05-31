import { AppError } from 'named-app-errors';
export * from 'named-app-errors';
export declare class ActivityGenerationError extends AppError {
    constructor(message?: string);
}
export declare class IdTypeError<T = string | number> extends AppError {
    constructor(id?: T);
}
