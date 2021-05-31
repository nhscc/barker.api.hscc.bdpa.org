// import 'expect-puppeteer'
import { name as pkgName } from '../package.json';
import debugFactory from 'debug';
import 'jest-extended';
import { verifyEnvironment } from '../expect-env';

const debug = debugFactory(`${pkgName}:jest-setup`);

// import type { Page, Browser, BrowserContext as Context } from 'puppeteer';

// declare global {
//     const page: Page;
//     const browser: Browser;
//     const context: Context;
// }

let env = {};

try {
  require('fs').accessSync('.env');
  env = require('dotenv').config().parsed;
  debug('new env vars: %O', env);
} catch (e) {
  debug(`env support disabled; reason: ${e}`);
}

verifyEnvironment();
