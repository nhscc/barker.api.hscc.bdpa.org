import type { NextApiResponse } from 'next';
import type { NextApiState } from 'types/global';
export declare type AsyncHanCallback = (params: NextApiState) => Promise<void>;
export declare type GenHanParams = NextApiState & {
    apiVersion?: number;
    methods: string[];
};
export declare function sendHttpContrivedError(res: NextApiResponse, responseJson?: Record<string, unknown>): void;
export declare const config: {
    api: {
        bodyParser: {
            sizeLimit: number;
        };
    };
};
/**
 * Generic middleware to handle any api endpoint. You can give it an empty async
 * handler function to trigger a 501 not implemented (to stub out API
 * endpoints).
 */
export declare function handleEndpoint(fn: AsyncHanCallback, { req, res, methods, apiVersion }: GenHanParams): Promise<void>;