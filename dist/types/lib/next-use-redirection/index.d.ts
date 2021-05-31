import type { FetchConfig } from 'isomorphic-json-fetch';
import type { FrontendRedirectConfig } from 'multiverse/next-isomorphic-redirect/types';
/**
 * Redirects to another location when configurable conditions are met.
 *
 * redirecting = null  - undecided
 * redirecting = true  - redirecting
 * redirecting = false - not redirecting
 * error is defined    - error occurred
 */
export declare function useRedirection<T>({ uri, redirectIf, redirectTo, redirectConfig, fetchConfig }: {
    uri: string;
    redirectIf?: (data: T) => boolean;
    redirectTo?: string;
    fetchConfig?: FetchConfig;
    redirectConfig?: FrontendRedirectConfig;
}): {
    redirecting: boolean | null;
    mutate: (data?: Record<string, unknown> | Promise<Record<string, unknown> | undefined> | import("swr/dist/types").MutatorCallback<Record<string, unknown> | undefined> | undefined, shouldRevalidate?: boolean | undefined) => Promise<Record<string, unknown> | undefined>;
    error: any;
};
