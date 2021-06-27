import { dummyDbData } from 'testverse/db';

import type { PublicUser } from 'types/global';
import type { NextApiHandler, PageConfig } from 'next';
import { toss } from 'toss-expression';

const tossError = () => toss(new Error('unexpected undefined param'));

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
  latest: TestResult;
  getResultAt: <T = unknown>(index: number) => TestResult<T>;
};

/**
 * Represents a test that executes an HTTP request and evaluate the response
 * for correctness.
 */
export type TestFixture = {
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
     * The expected response status. If status != 200, we expect
     * `json.success` to be `false`. Otherwise, we expect it to be `true`.
     */
    status: number | ((prevResults: TestResultset) => number);
    /**
     * The expected JSON response body or an async matcher. No need to test for
     * `success` as that is handled automatically. Jest async matchers are also
     * supported.
     */
    json:
      | Record<string, unknown>
      | jest.AsymmetricMatcher
      | ((
          prevResults: TestResultset
        ) => Record<string, unknown> | jest.AsymmetricMatcher);
  };
};

export function getFixtures(api: Record<string, NextApiHandlerMixin>): TestFixture[] {
  const initialBarkCount = dummyDbData.barks.length;
  const initialUserCount = dummyDbData.users.length;

  // TODO: LIFO, 400/404, 555 at proper cadence

  return [
    {
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount }
      }
    },
    {
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
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 1 }
      }
    },
    {
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
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalBarks: initialBarkCount, totalUsers: initialUserCount + 3 }
      }
    },
    {
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
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    },
    {
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
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 400,
        json: { error: expect.stringContaining('`name`') }
      }
    },
    {
      handler: api.users,
      method: 'POST',
      // @ts-expect-error: purposely using bad type here
      body: 'text',
      response: {
        status: 400,
        json: { error: expect.stringContaining('JSON') }
      }
    }
  ];
}
