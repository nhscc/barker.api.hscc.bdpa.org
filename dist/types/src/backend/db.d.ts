import { MongoClient, Db } from 'mongodb';
/**
 * Used to lazily create the database once on-demand instead of immediately when
 * the app runs.
 */
export declare function getDb(params?: {
    external: true;
}): Promise<Db>;
/**
 * Used to lazily create the database once on-demand instead of immediately when
 * the app runs. Returns the MongoClient instance used to connect to the
 * database.
 *
 * @param params If `{external: true}`, external Mongo connect URI will be used
 */
export declare function getDbClient(params?: {
    external: true;
}): Promise<MongoClient>;
/**
 * Used to kill the MongoClient and close any lingering database connections.
 */
export declare function closeDb(): Promise<void>;
/**
 * Used for testing purposes. Sets the global db instance to something else.
 */
export declare function setClientAndDb({ client, db }: {
    client: MongoClient;
    db: Db;
}): void;
/**
 * Destroys all collections in the database. Can be called multiple times
 * safely.
 */
export declare function destroyDb(db: Db): Promise<void>;
/**
 * This function is idempotent and can be called without worry of data loss.
 */
export declare function initializeDb(db: Db): Promise<void>;
