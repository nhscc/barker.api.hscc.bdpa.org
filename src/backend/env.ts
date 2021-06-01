import { parse as parseAsBytes } from 'bytes';
import { isServer } from 'is-server-side';
import { AppError } from 'universe/backend/error';

export function getEnv(loud = false) {
  const env = {
    NODE_ENV:
      process.env.APP_ENV || process.env.NODE_ENV || process.env.BABEL_ENV || 'unknown',
    MONGODB_URI: (process.env.MONGODB_URI || '').toString(),
    MONGODB_MS_PORT: !!process.env.MONGODB_MS_PORT
      ? Number(process.env.MONGODB_MS_PORT)
      : null,
    DISABLED_API_VERSIONS: !!process.env.DISABLED_API_VERSIONS
      ? process.env.DISABLED_API_VERSIONS.split(',')
      : [],
    RESULTS_PER_PAGE: Number(process.env.RESULTS_PER_PAGE),
    IGNORE_RATE_LIMITS:
      !!process.env.IGNORE_RATE_LIMITS && process.env.IGNORE_RATE_LIMITS !== 'false',
    LOCKOUT_ALL_KEYS:
      !!process.env.LOCKOUT_ALL_KEYS && process.env.LOCKOUT_ALL_KEYS !== 'false',
    DISALLOWED_METHODS: !!process.env.DISALLOWED_METHODS
      ? process.env.DISALLOWED_METHODS.split(',')
      : [],
    REQUESTS_PER_CONTRIVED_ERROR: Number(process.env.REQUESTS_PER_CONTRIVED_ERROR),
    MAX_CONTENT_LENGTH_BYTES: parseAsBytes(
      process.env.MAX_CONTENT_LENGTH_BYTES ?? '-Infinity'
    ),
    EXTERNAL_SCRIPTS_MONGODB_URI: (
      process.env.EXTERNAL_SCRIPTS_MONGODB_URI ||
      process.env.MONGODB_URI ||
      ''
    ).toString(),
    EXTERNAL_SCRIPTS_BE_VERBOSE:
      !!process.env.EXTERNAL_SCRIPTS_BE_VERBOSE &&
      process.env.EXTERNAL_SCRIPTS_BE_VERBOSE !== 'false',
    BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS: !!process.env
      .BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS
      ? Number(process.env.BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS)
      : null,
    BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: !!process.env.BAN_HAMMER_MAX_REQUESTS_PER_WINDOW
      ? Number(process.env.BAN_HAMMER_MAX_REQUESTS_PER_WINDOW)
      : null,
    BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: !!process.env
      .BAN_HAMMER_RESOLUTION_WINDOW_SECONDS
      ? Number(process.env.BAN_HAMMER_RESOLUTION_WINDOW_SECONDS)
      : null,
    BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES: !!process.env.BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES
      ? Number(process.env.BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES)
      : null,
    BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER: !!process.env
      .BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER
      ? Number(process.env.BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER)
      : null,
    PRUNE_DATA_MAX_LOGS: !!process.env.PRUNE_DATA_MAX_LOGS
      ? Number(process.env.PRUNE_DATA_MAX_LOGS)
      : null,
    HYDRATE_DB_ON_STARTUP:
      !!process.env.HYDRATE_DB_ON_STARTUP &&
      process.env.HYDRATE_DB_ON_STARTUP !== 'false',
    API_ROOT_URI: (process.env.API_ROOT_URI || '').toString(),
    DEBUG_MODE:
      process.env.TERM_PROGRAM == 'vscode' ||
      /--debug|--inspect/.test(process.execArgv.join(' '))
  };

  const _mustBeGtZero = [
    env.RESULTS_PER_PAGE,
    env.REQUESTS_PER_CONTRIVED_ERROR,
    env.MAX_CONTENT_LENGTH_BYTES
  ];

  if (loud && env.NODE_ENV == 'development') {
    /* eslint-disable-next-line no-console */
    console.info(`debug - ${env}`);
  }

  // ? Typescript troubles
  const NODE_X: string = env.NODE_ENV;
  const errors = [];

  NODE_X == 'unknown' && errors.push(`bad NODE_ENV, saw "${NODE_X}"`);

  isServer() &&
    env.MONGODB_URI === '' &&
    errors.push(`bad MONGODB_URI, saw "${env.MONGODB_URI}"`);

  isServer() &&
    _mustBeGtZero.some(
      (v) =>
        (typeof v != 'number' || isNaN(v) || v < 0) &&
        errors.push(`bad value "${v}", expected a number`)
    );

  if (errors.length)
    throw new AppError(`illegal environment detected:\n - ${errors.join('\n - ')}`);

  if (env.RESULTS_PER_PAGE < 15) throw new AppError(`RESULTS_PER_PAGE must be >= 15`);

  if (isServer() && env.MONGODB_MS_PORT && env.MONGODB_MS_PORT <= 1024)
    throw new AppError(`optional environment variable MONGODB_MS_PORT must be > 1024`);

  return env;
}
