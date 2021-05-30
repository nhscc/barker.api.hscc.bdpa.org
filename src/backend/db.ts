import { MongoClient, Db } from 'mongodb';
import { getEnv } from 'universe/backend/env';

type InternalMemory = { client: MongoClient; db: Db } | null;
let memory: InternalMemory = null;

/**
 * Used to lazily create the database once on-demand instead of immediately when
 * the app runs.
 */
export async function getDb(params?: { external: true }) {
  if (!memory) {
    memory = {} as NonNullable<InternalMemory>;

    let uri = getEnv().MONGODB_URI;

    if (params?.external) {
      uri = getEnv().EXTERNAL_SCRIPTS_MONGODB_URI;
      getEnv().EXTERNAL_SCRIPTS_BE_VERBOSE &&
        // eslint-disable-next-line no-console
        console.log(`[ connecting to mongo database at ${uri} ]`);
    }

    memory.client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    memory.db = memory.client.db();
  }

  return memory.db;
}

/**
 * Used to lazily create the database once on-demand instead of immediately when
 * the app runs. Returns the MongoClient instance used to connect to the
 * database.
 *
 * @param params If `{external: true}`, external Mongo connect URI will be used
 */
export async function getDbClient(params?: { external: true }) {
  !memory && (await getDb(params));
  // @ts-expect-error -- TypeScript doesn't realize memory will NOT be null
  return memory.client;
}

/**
 * Used to kill the MongoClient and close any lingering database connections.
 */
export async function closeDb() {
  memory?.client.isConnected() && (await memory?.client.close());
  memory = null;
}

/**
 * Used for testing purposes. Sets the global db instance to something else.
 */
export function setClientAndDb({ client, db }: { client: MongoClient; db: Db }) {
  memory = memory ?? ({} as NonNullable<InternalMemory>);
  memory.client = client;
  memory.db = db;
}

/**
 * Destroys all collections in the database. Can be called multiple times
 * safely.
 */
export async function destroyDb(db: Db) {
  await Promise.allSettled([
    db.dropCollection('keys'),
    db.dropCollection('request-log'),
    db.dropCollection('limited-log-mview'),
    db.dropCollection('barks'),
    db.dropCollection('users'),
    db.dropCollection('info')
  ]);
}

/**
 * This function is idempotent and can be called without worry of data loss.
 */
export async function initializeDb(db: Db) {
  await Promise.all([
    db.createCollection('keys'),
    db.createCollection('request-log'),
    db.createCollection('limited-log-mview'),
    db.createCollection('barks'),
    db.createCollection('users'),
    db.createCollection('info')
  ]);

  // TODO:
  // await Promise.all([
  //   barks.createIndex({ x: 1 }),
  //   barks.createIndex({ y: 1 }),
  //   barks.createIndex({ z: 1 })
  // ]);
}
