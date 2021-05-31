import type { FrontendRedirectConfig, BackendRedirectConfig, IsomorphicRedirectConfig } from './types';
/**
 * Redirects the client to a specific location when this function is called on
 * the frontend. This function should never be called from the backend. Supports
 * any valid URI.
 *
 * If `replace` is `true`, `Router.replace()` will be called, otherwise
 * `Router.push()` is used (default).
 *
 * If `bypassRouter` is `true` or `location` is a network-path reference, the
 * Router is bypassed and window.location will be used for a "hard" redirect.
 */
export declare const frontendRedirect: (location: string, config?: FrontendRedirectConfig | undefined) => void;
/**
 * Redirects the client to a specific location when this function is called
 * backend. This function should never be called from the frontend. Supports any
 * valid HTTP 3xx redirect target.
 *
 * If the `immediate` parameter is `true`, `res.end()` will be called,
 * immediately ending further processing of the response. It is false by
 * default.
 */
export declare const backendRedirect: (location: string, { res, status, immediate }: BackendRedirectConfig) => void;
/**
 * Redirects the client to a specific location regardless of the runtime:
 * frontend or backend. Supports any valid URI or HTTP 3xx redirect target.
 *
 * To keep this function's behavior simple to reason about, note that if
 * IsomorphicRedirectConfig does not have a "res" key, then this function MUST
 * be executing on the frontend. An Error will be thrown if this is not the
 * case.
 */
export declare const isomorphicRedirect: (location: string, { res, status, immediate, replace }: IsomorphicRedirectConfig) => void;
