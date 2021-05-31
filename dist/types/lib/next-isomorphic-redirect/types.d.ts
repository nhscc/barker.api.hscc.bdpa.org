import type { NextApiResponse } from 'next';
import type { HttpStatusCode } from '@ergodark/next-types';
export declare type FrontendRedirectConfig = {
    replace?: boolean;
    bypassRouter?: boolean;
};
export declare type BackendRedirectConfig = {
    res: NextApiResponse;
    status?: HttpStatusCode;
    immediate?: boolean;
};
export declare type IsomorphicRedirectConfig = FrontendRedirectConfig & BackendRedirectConfig;
export type { HttpStatusCode };
