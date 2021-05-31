import { ObjectId } from 'mongodb';
import type { NextApiRequest } from 'next';
import type { NextApiState } from 'types/global';
export declare const NULL_KEY = "00000000-0000-0000-0000-000000000000";
export declare const DUMMY_KEY = "12349b61-83a7-4036-b060-213784b491";
export declare function getBarksById(params: {
    ids: ObjectId[];
    key: string;
}): Promise<never[] | undefined>;
export declare function isKeyAuthentic(key: string): Promise<boolean>;
/**
 * Note that this async function does not have to be awaited. It's fire and
 * forget!
 */
export declare function addToRequestLog({ req, res }: NextApiState): Promise<void>;
export declare function isRateLimited(req: NextApiRequest): Promise<{
    limited: boolean;
    retryAfter: number;
}>;
export declare function isDueForContrivedError(): boolean;
export declare function getApiKeys(): Promise<{
    key: string;
    owner: string;
}[]>;
export declare function searchBarks(params: {
    key: string;
    after: ObjectId | null;
    match: {
        [specifier: string]: string | number | ObjectId | {
            [subspecifier in '$gt' | '$lt' | '$gte' | '$lte']?: string | number;
        };
    };
    regexMatch: {
        [specifier: string]: string | ObjectId;
    };
}): Promise<unknown[]>;
export declare function generateActivity(silent?: boolean): Promise<void>;
