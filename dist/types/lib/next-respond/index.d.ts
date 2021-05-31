import type { NextApiResponse } from 'next';
import type { HttpStatusCode, SuccessJsonResponse, ErrorJsonResponse } from './types';
export declare function sendGenericHttpResponse(res: NextApiResponse, statusCode: HttpStatusCode, responseJson?: Record<string, unknown>): void;
export declare function sendHttpSuccessResponse(res: NextApiResponse, statusCode: HttpStatusCode, responseJson?: Record<string, unknown>): SuccessJsonResponse;
export declare function sendHttpErrorResponse(res: NextApiResponse, statusCode: HttpStatusCode, responseJson: Record<string, unknown> & {
    error: string;
}): ErrorJsonResponse;
export declare function sendHttpOk(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpBadRequest(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpUnauthenticated(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpUnauthorized(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpNotFound(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpBadMethod(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpTooLarge(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpRateLimited(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendHttpError(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare function sendNotImplementedError(res: NextApiResponse, responseJson?: Record<string, unknown>): void;