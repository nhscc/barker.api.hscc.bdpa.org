import { MongoClient, ObjectId } from 'mongodb';
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
import { usernames } from '../data/corpus.json';
import { randomInt } from 'crypto';

import type { Db, WithId } from 'mongodb';

import type {
  ApiKey,
  RequestLogEntry,
  LimitedLogEntry,
  InternalBark,
  InternalUser,
  InternalInfo
} from 'types/global';

export type DummyDbData = {
  keys: WithId<ApiKey>[];
  barks: WithId<InternalBark>[];
  users: WithId<InternalUser>[];
  info: WithId<InternalInfo>;
};

export const dummyDbData: DummyDbData = {
  keys: [
    {
      _id: new ObjectId(),
      owner: 'chapter1',
      key: DUMMY_KEY
    },
    {
      _id: new ObjectId(),
      owner: 'chapter2',
      key: 'xyz4c4d3-294a-4086-9751-f3fce82da'
    },
    {
      _id: new ObjectId(),
      owner: 'chapter3',
      key: '35b6ny53-83a7-gf0r-b060-b4ywayrht'
    },
    {
      _id: new ObjectId(),
      owner: 'chapter4',
      key: 'h90wgbrd-294a-536h-9751-rydmjetgg'
    }
  ],
  barks: [],
  users: Array.from({ length: 10 }).map<WithId<InternalUser>>((_, ndx) => ({
    _id: new ObjectId(),
    name: `Fake${ndx} User${ndx}`,
    email: `${ndx}-user-email@site.com`,
    phone: `555-555-555${ndx}`,
    username: usernames[randomInt(usernames.length)],
    packmates: [],
    following: [],
    bookmarked: [],
    liked: [],
    deleted: false,
    meta: {
      followability: 0,
      influence: 0
    }
  })),
  info: {
    _id: new ObjectId(),
    totalBarks: 100,
    totalUsers: 10
  }
};

let lastRandomMoment = Math.floor(Date.now() / (Math.random() * 10000000));

// ? Monotonically increasing moments occurring after one another but not
// ? bunching up at the end
const getRandomMoment = () =>
  (lastRandomMoment += Math.floor((Math.random() * (Date.now() - lastRandomMoment)) / 2));

dummyDbData.barks = Array.from({ length: 100 }).map<WithId<InternalBark>>((_, ndx) => {
  return {
    _id: new ObjectId(),
    owner: dummyDbData.users[ndx % 10]._id,
    content: `#${ndx} bark contents`,
    createdAt: getRandomMoment(),
    likes: randomInt(300),
    rebarks: randomInt(200),
    barkbacks: randomInt(100),
    deleted: randomInt(100) <= 10,
    private: randomInt(100) <= 10,
    barkbackTo: ndx % 10 == 0 ? new ObjectId() : null,
    rebarkOf: ndx && ndx % 11 == 0 ? new ObjectId() : null,
    meta: {
      barkbackability: Math.random(),
      likeability: Math.random(),
      rebarkability: Math.random()
    }
  };
});

export async function hydrateDb(db: Db, data: DummyDbData) {
  const newData = cloneDeep(data);

  await Promise.all([
    ...[newData.keys.length ? db.collection('keys').insertMany(newData.keys) : null],
    ...[newData.users.length ? db.collection('users').insertMany(newData.users) : null],
    ...[newData.barks.length ? db.collection('barks').insertMany(newData.barks) : null],
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

  return newData;
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
    await hydrateDb(db, dummyDbData);
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
    getNewClientAndDb
  };
}
