import { MongoClient } from 'mongodb';
import { NULL_KEY, DUMMY_KEY } from 'universe/backend';
import {
  getDb,
  setClientAndDb,
  destroyDb,
  initializeDb,
  getDbClient
} from 'universe/backend/db';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cloneDeep from 'clone-deep';
import { getEnv } from 'universe/backend/env';

import type { Db, WithId } from 'mongodb';

import type {
  ApiKey,
  RequestLogEntry,
  LimitedLogEntry,
  InternalBark,
  InternalUser,
  InternalInfo
} from 'types/global';

export const EXPAND_RESULTS_BY_MULT = 2.5;

export type DummyDbData = {
  keys: ApiKey[];
  barks: InternalBark[];
  users: InternalUser[];
  info: InternalInfo;
};

export type HydratedDummyDbData = {
  [P in keyof DummyDbData]: DummyDbData[P] extends Array<infer T> | undefined
    ? WithId<T>[]
    : WithId<DummyDbData[P]>;
};

export const unhydratedDummyDbData: DummyDbData = {
  keys: [
    {
      owner: 'chapter1',
      key: DUMMY_KEY
    },
    {
      owner: 'chapter2',
      key: 'xyz4c4d3-294a-4086-9751-f3fce82da'
    },
    {
      owner: 'chapter3',
      key: '35b6ny53-83a7-gf0r-b060-b4ywayrht'
    },
    {
      owner: 'chapter4',
      key: 'h90wgbrd-294a-536h-9751-rydmjetgg'
    }
  ],
  barks: [],
  users: [],
  info: { totalBarks: 100, totalUsers: 10 }
};

export async function hydrateDb(db: Db, data: DummyDbData) {
  const newData = cloneDeep(data);

  await Promise.all([
    ...[newData.keys.length ? db.collection('keys').insertMany(newData.keys) : null],
    // ...[
    //   newData.airports.length
    //     ? db.collection('airports').insertMany(newData.airports)
    //     : null
    // ],
    // ...[
    //   newData.airlines.length
    //     ? db.collection('airlines').insertMany(newData.airlines)
    //     : null
    // ],
    // ...[
    //   newData.noFlyList.length
    //     ? db.collection('no-fly-list').insertMany(newData.noFlyList)
    //     : null
    // ],
    // ...[
    //   newData.flights.length ? db.collection('flights').insertMany(newData.flights) : null
    // ],
    ...[newData.info ? db.collection('info').insertMany([newData.info]) : null],

    db.collection<WithId<RequestLogEntry>>('request-log').insertMany(
      [...Array(22)].map((_, ndx) => ({
        ip: '1.2.3.4',
        key: ndx % 2 ? null : NULL_KEY,
        method: ndx % 3 ? 'GET' : 'POST',
        route: 'fake/route',
        time: Date.now() + 10 ** 6,
        resStatusCode: 200
      }))
    ),

    db
      .collection<WithId<LimitedLogEntry>>('limited-log-mview')
      .insertMany([
        { ip: '1.2.3.4', until: Date.now() + 1000 * 60 * 15 } as LimitedLogEntry,
        { ip: '5.6.7.8', until: Date.now() + 1000 * 60 * 15 } as LimitedLogEntry,
        { key: NULL_KEY, until: Date.now() + 1000 * 60 * 60 } as LimitedLogEntry
      ])
  ]);

  return newData as HydratedDummyDbData;
}

export function setupJest() {
  const port = getEnv().DEBUG_MODE ? getEnv().MONGODB_MS_PORT : undefined;

  const server = new MongoMemoryServer({
    instance: {
      port,
      // ? Latest mongo versions error without this line
      args: ['--enableMajorityReadConcern=0']
    }
  });

  let uri: string;
  let hydratedData: HydratedDummyDbData;
  let oldEnv: typeof process.env;

  /**
   * Similar to getDb except it creates a new MongoClient connection before
   * selecting and returning the database.
   */
  const getNewClientAndDb = async () => {
    uri = uri ?? (await server.getUri('test')); // ? Ensure singleton
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db();

    if (!db) throw new Error('unable to connect to database');

    return { client, db };
  };

  beforeAll(async () => {
    setClientAndDb(await getNewClientAndDb());
  });

  beforeEach(async () => {
    oldEnv = process.env;
    const db = await getDb();
    await initializeDb(db);
    hydratedData = await hydrateDb(db, unhydratedDummyDbData);
  });

  afterEach(async () => {
    process.env = oldEnv;
    const db = await getDb();
    await destroyDb(db);
  });

  afterAll(async () => {
    const client = await getDbClient();
    client.isConnected() && (await client.close());
    await server.stop();
  });

  return {
    getDb,
    getDbClient,
    getNewClientAndDb,
    getHydratedData: () => hydratedData
  };
}
