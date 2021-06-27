import { dummyDbData } from 'testverse/db';

import type { PublicUser } from 'types/global';
import type { NextApiHandler, PageConfig } from 'next';
import { toss } from 'toss-expression';

// TODO: turn this into some kind of package :)

const tossError = () => toss(new Error('sanity check failed'));

export type NextApiHandlerMixin = NextApiHandler<unknown> & {
  config?: PageConfig;
  url?: string;
};

/**
 * A single test result stored in `memory`.
 */
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
  getResultAt: <T = unknown>(index: number) => TestResult<T>;
};

/**
 * Represents a test that executes an HTTP request and evaluate the response
 * for correctness.
 */
export type TestFixture = {
  /**
   * A very brief couple of words added to the end of the test title.
   */
  subject?: string;
  /**
   * The handler under test.
   */
  handler: NextApiHandlerMixin;
  /**
   * The method of the mock request.
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
  response: {
    /**
     * The expected response status. If status != 200, we expect `json.success`
     * to be `false`. Otherwise, we expect it to be `true`. All status-related
     * checks are skipped if if a callback is provided that returns `undefined`.
     */
    status: number | ((status: number, prevResults: TestResultset) => number | undefined);
    /**
     * The expected JSON response body. No need to test for `success` as that is
     * handled automatically (unless a status callback was used and it returned
     * `undefined`). Jest async matchers are also supported. All json-related
     * checks are skipped if a callback is provided that returns `undefined`.
     */
    json:
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

  return [
    {
      subject: 'initial metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount }
      }
    },
    {
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
      subject: 'metadata accurate',
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
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(-2).json?.user.user_id || tossError()
        };
      },
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
      subject: 'metadata accurate',
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
      subject: 'metadata accurate',
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
          const users = (json?.users as PublicUser[]) || tossError();

          expect(users[0]).toStrictEqual({
            user_id: getResultAt<{ user: PublicUser }>(5).json?.user.user_id,
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
            user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id,
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
            user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id,
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
    }
    // {
    //   handler: api.users,
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(-2).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'GET',
    //   response: {
    //     status: 200,
    //     json: {
    //       user: {
    //         user_id: expect.any(String),
    //         name: 'Hillary Clinton',
    //         email: 'h@hillaryclinton.com',
    //         phone: '773-555-7777',
    //         username: 'the-hill',
    //         packmates: 0,
    //         following: 0,
    //         bookmarked: 0,
    //         liked: 0,
    //         deleted: false
    //       }
    //     }
    //   }
    // }
  ];
}
