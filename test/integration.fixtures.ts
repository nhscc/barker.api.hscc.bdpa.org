import { dummyDbData } from 'testverse/db';

import type { PublicBark, PublicUser } from 'types/global';
import type { NextApiHandler, PageConfig } from 'next';
import { toss } from 'toss-expression';
import { ObjectId } from 'mongodb';

// TODO: turn a lot of this into some kind of package; needs to be generic
// TODO: enough to handle various use cases though :) Maybe
// TODO: @xunnamius/test-factory for the generic version, along with
// TODO: @xunnamius/test-factory-next, @xunnamius/test-factory-next-api (below),
// TODO: @xunnamius/test-factory-X plugins

// TODO: add an `id` param that allows getResultAt using that `id` (along with
// TODO: index)

// TODO: document functionality: RUN_ONLY='#, ##,###,...'
// TODO: "fail fast" should be optional

export type NextApiHandlerMixin = NextApiHandler<unknown> & {
  config?: PageConfig;
  url?: string;
};

/**
 * A single test result stored in `memory`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TestResult<T = any> = {
  status: number;
  json: T | undefined;
};

/**
 * Stored results from past fixtures runs made available for future fixtures
 * runs via `memory`.
 */
export type TestResultset = TestResult[] & {
  /**
   * A property containing a mapping between optional test ids and their
   * results.
   */
  idMap: Record<string, TestResult>;
  /**
   * A property containing the most previous resultset.
   */
  latest: TestResult;
  /**
   * Get the HTTP response status and json result from previously run tests by
   * index. You can pass a negative index to begin counting backwards from the
   * current test. Tests are zero-indexed, i.e. use `getResultAt(0)` to refer to
   * the very first resultset. `getResultAt(1)` will return the second
   * resultset. `getResultAt(-1)` will return the immediately previous resultset
   * (same as what the `latest` property returns).
   *
   * @param index Specify a previous test result index starting at 1 (not zero!)
   */
  getResultAt<T = unknown>(index: number): TestResult<T>;
  getResultAt<T = unknown>(index: number, prop: string): T;
  getResultAt<T = unknown>(index: string): TestResult<T>;
  getResultAt<T = unknown>(index: string, prop: string): T;
};

/**
 * Represents a test that executes an HTTP request and evaluate the response
 * for correctness.
 */
export type TestFixture = {
  /**
   * An optional id that can be used to reference the result from this fixture
   * directly as opposed to by index.
   *
   * @example getResultAt('my-id') === getResultAt(22)
   */
  id?: string;
  /**
   * The test index X (as in "#X") that is reported to the user when a test
   * fails.
   */
  displayIndex: number;
  /**
   * A very brief couple of words added to the end of the test title.
   */
  subject?: string;
  /**
   * The handler under test.
   */
  handler?: NextApiHandlerMixin;
  /**
   * The method of the mock request.
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**
   * Represents mock "processed" dynamic route components and query params.
   */
  params?:
    | Record<string, string | string[]>
    | ((prevResults: TestResultset) => Record<string, string | string[]>);
  /**
   * The body of the mock request. Automatically stringified.
   */
  body?:
    | Record<string, unknown>
    | ((prevResults: TestResultset) => Record<string, unknown>);
  /**
   * The expected shape of the HTTP response.
   */
  response?: {
    /**
     * The expected response status. If status != 200, we expect `json.success`
     * to be `false`. Otherwise, we expect it to be `true`. All status-related
     * checks are skipped if if a callback is provided that returns `undefined`.
     */
    status?:
      | number
      | ((status: number, prevResults: TestResultset) => number | undefined);
    /**
     * The expected JSON response body. No need to test for `success` as that is
     * handled automatically (unless a status callback was used and it returned
     * `undefined`). Jest async matchers are also supported. All json-related
     * checks are skipped if a callback is provided that returns `undefined` or
     * `json` itself is `undefined`.
     */
    json?:
      | Record<string, unknown>
      | jest.AsymmetricMatcher
      | ((
          json: Record<string, unknown> | undefined,
          prevResults: TestResultset
        ) => Record<string, unknown> | jest.AsymmetricMatcher | undefined);
  };
};

export function getFixtures(api: Record<string, NextApiHandlerMixin>): TestFixture[] {
  const initialBarkCount = dummyDbData.barks.length;
  const initialUserCount = dummyDbData.users.length;
  const targetedForDeletion = dummyDbData.barks
    .slice(0, 10)
    .filter((bark) => !bark.deleted)
    .map((bark) => bark._id.toHexString());

  const runOnly = process.env.RUN_ONLY?.split(',')
    .map((n) => parseInt(n))
    .sort((a, b) => a - b);

  const fixtures: Omit<TestFixture, 'displayIndex'>[] = [
    {
      subject: 'get metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount }
      }
    },
    {
      id: 'user-hillary',
      subject: 'valid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Hillary Clinton',
        email: 'h@hillaryclinton.com',
        phone: '773-555-7777',
        username: 'the-hill'
      },
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Hillary Clinton',
            email: 'h@hillaryclinton.com',
            phone: '773-555-7777',
            username: 'the-hill',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          }
        }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 1 }
      }
    },
    {
      subject: 'fetch created user',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'GET',
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Hillary Clinton',
            email: 'h@hillaryclinton.com',
            phone: '773-555-7777',
            username: 'the-hill',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          }
        }
      }
    },
    {
      id: 'user-test-1',
      subject: 'valid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '123-555-6666',
        username: 'test-user-1'
      },
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Test User',
            email: 'test@test.com',
            phone: '123-555-6666',
            username: 'test-user-1',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          }
        }
      }
    },
    {
      id: 'user-test-2',
      subject: 'valid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-2'
      },
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Test User 2',
            email: 'test2@test.com',
            phone: '555-666-7777',
            username: 'test-user-2',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          }
        }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 3 }
      }
    },
    {
      subject: 'invalid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-2'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that username') }
      }
    },
    {
      subject: 'invalid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-X'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      // * #10
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
      subject: 'invalid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'testXXX@aol.com',
        phone: '555-666-7777',
        username: 'test-user-X'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that phone number') }
      }
    },
    {
      subject: 'invalid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2!',
        email: 'testXXX@aol.com',
        phone: '555-666-7777',
        username: 'test-user-X'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('alphanumeric') }
      }
    },
    {
      subject: 'invalid create user',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 400,
        json: { error: expect.stringContaining('`name`') }
      }
    },
    {
      subject: 'invalid create user',
      handler: api.users,
      method: 'POST',
      // @ts-expect-error: purposely using bad type here
      body: 'text',
      response: {
        status: 400,
        json: { error: expect.stringContaining('JSON') }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 3 }
      }
    },
    {
      subject: 'users returned in FIFO order',
      handler: api.users,
      method: 'GET',
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          const users =
            (json?.users as PublicUser[]) || toss(new Error('missing "users" in result'));

          expect(users[0]).toStrictEqual({
            user_id: getResultAt<string>('user-test-2', 'user.user_id'),
            name: 'Test User 2',
            email: 'test2@test.com',
            phone: '555-666-7777',
            username: 'test-user-2',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          });

          expect(users[1]).toStrictEqual({
            user_id: getResultAt<string>('user-test-1', 'user.user_id'),
            name: 'Test User',
            email: 'test@test.com',
            phone: '123-555-6666',
            username: 'test-user-1',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          });

          expect(users[2]).toStrictEqual({
            user_id: getResultAt<string>('user-hillary', 'user.user_id'),
            name: 'Hillary Clinton',
            email: 'h@hillaryclinton.com',
            phone: '773-555-7777',
            username: 'the-hill',
            packmates: 0,
            following: 0,
            bookmarked: 0,
            liked: 0,
            deleted: false
          });

          return undefined;
        }
      }
    },
    {
      subject: 'fetch invalid user',
      handler: api.usersId,
      params: { user_id: 'blah-blah-blah' },
      method: 'GET',
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid user_id "blah-blah-blah"') }
      }
    },
    {
      subject: 'fetch non-existent user',
      handler: api.usersId,
      params: { user_id: new ObjectId().toHexString() },
      method: 'GET',
      response: {
        status: 404,
        json: { error: expect.stringContaining('not found') }
      }
    },
    {
      subject: 'valid delete user',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'DELETE',
      response: { status: 200 }
    },
    {
      // * #20
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 2 }
      }
    },
    {
      subject: 'get deleted user',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'GET',
      response: {
        status: 200,
        json: { user: expect.objectContaining({ deleted: true }) }
      }
    },
    {
      subject: 'delete deleted user (noop)',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'DELETE',
      response: { status: 200 }
    },
    {
      subject: 'deleted user no longer listed',
      handler: api.users,
      method: 'GET',
      response: {
        status: 200,
        json: { users: expect.not.objectContaining([{ email: 'h@hillaryclinton.com' }]) }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 2 }
      }
    },
    {
      subject: 'new user properties',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555'
      },
      response: { status: 200 }
    },
    {
      subject: "can't change username",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        username: 'ewarren',
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('unexpected properties') }
      }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: { email: 'test2@test.com', name: 'Elizabeth Warren', phone: '978-555-5555' },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        email: 'h@hillaryclinton.com',
        name: 'Elizabeth Warren',
        phone: '978-555-5555'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      // * #30
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: { name: 'Elizabeth Warren', phone: '555-666-7777', email: 'fake@email.com' },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that phone number') }
      }
    },
    {
      subject: 'get user like count',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'GET',
      response: {
        status: 200,
        json: {
          user: expect.objectContaining({ liked: 0 })
        }
      }
    },
    {
      id: 'bark-user-test-1',
      subject: 'valid create bark',
      handler: api.barks,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        content: 'Hello, Barker world!',
        private: false,
        barkbackTo: null,
        rebarkOf: null
      }),
      response: {
        status: 200,
        json: (_, { getResultAt }) => ({
          bark: {
            owner: getResultAt<string>('user-test-1', 'user.user_id'),
            content: 'Hello, Barker world!',
            createdAt: expect.any(Number),
            deleted: false,
            private: false,
            barkbackTo: null,
            rebarkOf: null,
            bark_id: expect.any(String),
            likes: 0,
            rebarks: 0,
            barkbacks: 0
          }
        })
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount + 1, totalUsers: initialUserCount + 2 }
      }
    },
    {
      subject: 'invalid create bark',
      handler: api.barks,
      method: 'POST',
      body: {
        owner: '60d6501dc703d70008603dc9',
        content: 'Hello, bark world!',
        private: false,
        barkbackTo: null,
        rebarkOf: null
      },
      response: {
        status: 404,
        json: {
          error: expect.stringContaining('"60d6501dc703d70008603dc9" was not found')
        }
      }
    },
    {
      subject: 'invalid create bark',
      handler: api.barks,
      method: 'POST',
      body: {
        owner: 'bad-key',
        content: 'Hello, bark world!',
        private: false,
        barkbackTo: null,
        rebarkOf: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid') }
      }
    },
    {
      subject: 'invalid create bark',
      handler: api.barks,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        content: 'Hello, Barker world!',
        private: false,
        barkbackTo: '60d6501dc703d70008603dc9',
        rebarkOf: null
      }),
      response: {
        status: 404,
        json: {
          error: expect.stringContaining('"60d6501dc703d70008603dc9" was not found')
        }
      }
    },
    {
      subject: 'invalid create bark',
      handler: api.barks,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        content: 'Hello, Barker world!',
        private: false,
        barkbackTo: 'bad-key',
        rebarkOf: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid') }
      }
    },
    {
      subject: 'invalid create bark',
      handler: api.barks,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        content: 'Hello, Barker world!',
        private: false,
        barkbackTo: null,
        rebarkOf: '60d6501dc703d70008603dc9'
      }),
      response: {
        status: 404,
        json: {
          error: expect.stringContaining('"60d6501dc703d70008603dc9" was not found')
        }
      }
    },
    {
      // * #40
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
      subject: 'invalid create bark',
      handler: api.barks,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        content: 'Hello, Barker world!',
        private: false,
        barkbackTo: null,
        rebarkOf: 'bad-key'
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid') }
      }
    },
    {
      subject: 'like new bark',
      handler: api.barksIdLikesId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'confirm user liked count',
      handler: api.usersId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json) => {
          expect((json?.user as PublicUser).liked).toBe(1);
          return undefined;
        }
      }
    },
    {
      subject: 'confirm bark likes count',
      handler: api.barksIds,
      method: 'GET',
      params: ({ getResultAt }) => ({
        bark_ids: [getResultAt<string>('bark-user-test-1', 'bark.bark_id')]
      }),
      response: {
        status: 200,
        json: (json) => {
          const barks = json?.barks as PublicBark[];
          expect(barks).toBeArrayOfSize(1);
          expect(barks[0]).toStrictEqual(expect.objectContaining({ likes: 1 }));
          return undefined;
        }
      }
    },
    {
      subject: 'get liked barks',
      handler: api.usersIdLiked,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.barks as string[]).toStrictEqual([
            getResultAt<string>('bark-user-test-1', 'bark.bark_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'barks-is-liked endpoint 200s',
      handler: api.barksIdLikesId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'users-liked-bark endpoint 200s',
      handler: api.usersIdLikedId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'get users who liked bark',
      handler: api.barksIdLikes,
      method: 'GET',
      params: ({ getResultAt }) => ({
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.users).toStrictEqual([
            getResultAt<string>('user-test-1', 'user.user_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'unlike bark',
      handler: api.barksIdLikesId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 200 }
    },
    {
      // * #50
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
      subject: 'unlike unliked bark (noop)',
      handler: api.barksIdLikesId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'get users who liked bark',
      handler: api.barksIdLikes,
      method: 'GET',
      params: ({ getResultAt }) => ({
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: {
        status: 200,
        json: { users: [] }
      }
    },
    {
      subject: 'barks-is-liked endpoint 404s',
      handler: api.barksIdLikesId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'users-liked-bark endpoint 404s',
      handler: api.usersIdLikedId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        bark_id: getResultAt<string>('bark-user-test-1', 'bark.bark_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'confirm user liked count',
      handler: api.usersId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json) => {
          expect((json?.user as PublicUser).liked).toBe(0);
          return undefined;
        }
      }
    },
    {
      subject: 'confirm bark likes counts',
      handler: api.barksIds,
      method: 'GET',
      params: ({ getResultAt }) => ({
        bark_ids: [getResultAt<string>('bark-user-test-1', 'bark.bark_id')]
      }),
      response: {
        status: 200,
        json: (json) => {
          const barks = json?.barks as PublicBark[];
          expect(barks).toBeArrayOfSize(1);
          expect(barks[0]).toStrictEqual(expect.objectContaining({ likes: 0 }));
          return undefined;
        }
      }
    },
    {
      subject: 'get liked barks',
      handler: api.usersIdLiked,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: { barks: [] }
      }
    },
    {
      subject: 'delete some barks',
      handler: api.barksIds,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        bark_ids: [
          getResultAt<string>('bark-user-test-1', 'bark.bark_id'),
          ...targetedForDeletion
        ]
      }),
      response: { status: 200 }
    },
    {
      subject: 'get deleted barks',
      handler: api.barksIds,
      method: 'GET',
      params: ({ getResultAt }) => ({
        bark_ids: [
          getResultAt<string>('bark-user-test-1', 'bark.bark_id'),
          ...targetedForDeletion
        ]
      }),
      response: {
        status: 200,
        json: {
          barks: Array.from({ length: targetedForDeletion.length + 1 }).map(() =>
            expect.objectContaining({ deleted: true })
          )
        }
      }
    },
    {
      // * #60
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
      subject: 'delete deleted barks (noop)',
      handler: api.barksIds,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        bark_ids: [
          getResultAt<string>('bark-user-test-1', 'bark.bark_id'),
          ...targetedForDeletion
        ]
      }),
      response: { status: 200 }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount - 10, totalUsers: initialUserCount + 2 }
      }
    }
    // {
    //   subject: 'get following users'
    // },
    // {
    //   subject: 'get following count'
    // },
    // {
    //   subject: 'is-following endpoint 404s'
    // },
    // {
    //   subject: 'follow user'
    // },
    // {
    //   subject: 'is-following endpoint 200s'
    // },
    // {
    //   subject: 'confirm following count'
    // },
    // {
    //   subject: 'get following users'
    // },
    // {
    //   subject: 'get following with includeIndirect'
    // },
    // {
    //   subject: 'unfollow user'
    // },
    // {
    //   subject: 'unfollow unfollowed user (noop)',
    //   handler: api.usersId,
    //   method: 'DELETE',
    //   params: ({ getResultAt }) => ({ user_id: getResultAt<string>('user-hillary', 'user.user_id') }),
    //   response: { status: 200 }
    // },
    // {
    //   subject: 'is-following endpoint 404s'
    // },
    // {
    //   subject: 'confirm following count'
    // },
    // {
    //   subject: 'get following users'
    // },
    // {
    //   subject: 'get packmates'
    // },
    // {
    //   subject: 'get packmate count'
    // },
    // {
    //   subject: 'is-packmate endpoint 404s'
    // },
    // {
    //   subject: 'add packmate'
    // },
    // {
    //   subject: 'is-packmate endpoint 200s'
    // },
    // {
    //   subject: 'confirm packmate count'
    // },
    // {
    //   subject: 'get packmates'
    // },
    // {
    //   subject: 'remove packmate'
    // },
    // {
    //   subject: 'remove removed packmate (noop)',
    //   handler: api.usersId,
    //   method: 'DELETE',
    //   params: ({ getResultAt }) => ({ user_id: getResultAt<string>('user-hillary', 'user.user_id') }),
    //   response: { status: 200 }
    // },
    // {
    //   subject: 'is-packmate endpoint 404s'
    // },
    // {
    //   subject: 'confirm packmate count'
    // },
    // {
    //   subject: 'get packmates'
    // },
    // {
    //   subject: 'get bookmarked barks'
    // },
    // {
    //   subject: 'get bookmarked count'
    // },
    // {
    //   subject: 'is-bookmarked endpoint 404s'
    // },
    // {
    //   subject: 'bookmark bark'
    // },
    // {
    //   subject: 'is-bookmarked endpoint 200s'
    // },
    // {
    //   subject: 'confirm bookmarked count'
    // },
    // {
    //   subject: 'get bookmarked barks'
    // },
    // {
    //   subject: 'unbookmark bark'
    // },
    // {
    //   subject: 'unbookmark unbookmarked bark (noop)',
    //   handler: api.usersId,
    //   method: 'DELETE',
    //   params: ({ getResultAt }) => ({ user_id: getResultAt<string>('user-hillary', 'user.user_id') }),
    //   response: { status: 200 }
    // },
    // {
    //   subject: 'is-bookmarked endpoint 404s'
    // },
    // {
    //   subject: 'confirm bookmarked count'
    // },
    // {
    //   subject: 'get bookmarked barks'
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.barks
    // },
    // {
    //   subject: 'page size = max id count',
    //   handler: api.barksIds
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.barksIdLikes
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.users
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.usersIdLiked
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.usersIdFollowing
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.usersIdPack
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.usersIdBookmarks
    // },
    // {
    //   subject: 'pagination',
    //   handler: api.barksSearch
    // },
    // {
    //   subject: 'search returns expected barks'
    // },
    // {
    //   subject: 'search returns expected barks'
    // },
    // {
    //   subject: 'search returns expected barks'
    // },
    // {
    //   subject: 'search returns expected barks'
    // },
    // {
    //   subject: 'search returns expected barks'
    // }
  ];

  return fixtures.filter<TestFixture>((test, ndx): test is TestFixture => {
    const displayIndex = ndx + 1;
    if (runOnly && !runOnly.includes(displayIndex)) return false;
    (test as TestFixture).displayIndex = !runOnly
      ? displayIndex
      : runOnly.shift() ?? toss(new Error('ran out of RUN_ONLY indices'));
    return true;
  });
}
