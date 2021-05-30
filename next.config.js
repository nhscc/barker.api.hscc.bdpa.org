const withBundleAnalyzer = require('@next/bundle-analyzer');

require('./src/dev-utils').populateEnv();

module.exports = () => {
  return withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
  })({
    // ? Renames the build dir "build" instead of ".next"
    distDir: 'build',

    // ? Webpack configuration
    // ! Note that the webpack configuration is executed twice: once
    // ! server-side and once client-side!
    webpack: (config) => {
      // ? These are aliases that can be used during JS import calls
      // ! If changed, also update these aliases in tsconfig.json,
      // ! jest.config.js, webpack.config.ts, and .eslintrc.js
      config.resolve &&
        (config.resolve.alias = {
          ...config.resolve.alias,
          universe: `${__dirname}/src/`,
          multiverse: `${__dirname}/lib/`,
          externals: `${__dirname}/external-scripts/`,
          types: `${__dirname}/types/`
        });

      return config;
    },

    // ? Select some environment variables defined in .env to push to the
    // ? client.
    // !! DO NOT PUT ANY SECRET ENVIRONMENT VARIABLES HERE !!
    env: {
      RESULTS_PER_PAGE: process.env.RESULTS_PER_PAGE,
      IGNORE_RATE_LIMITS: process.env.IGNORE_RATE_LIMITS,
      LOCKOUT_ALL_KEYS: process.env.LOCKOUT_ALL_KEYS,
      DISALLOWED_METHODS: process.env.DISALLOWED_METHODS,
      REQUESTS_PER_CONTRIVED_ERROR: process.env.REQUESTS_PER_CONTRIVED_ERROR,
      MAX_CONTENT_LENGTH_BYTES: process.env.MAX_CONTENT_LENGTH_BYTES
    },

    async rewrites() {
      return [
        {
          source: '/v1/:path*',
          destination: '/api/v1/:path*'
        },
        {
          source: '/v2/:path*',
          destination: '/api/v2/:path*'
        }
      ];
    }
  });
};
