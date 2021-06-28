import { dummyDbData } from 'testverse/db';

import type { PublicUser } from 'types/global';
import type { NextApiHandler, PageConfig } from 'next';
import { toss } from 'toss-expression';
import { ObjectId } from 'mongodb';

// TODO: turn a lot of this into some kind of package; needs to be generic
// TODO: enough to handle various use cases though :)

// TODO: add an `id` param that allows getResultAt using that `id` (along with
// TODO: index)

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

  return [
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
    },
    {
      subject: 'fetch invalid user',
      handler: api.usersId,
      params: { user_id: 'blah-blah-blah' },
      method: 'GET',
      response: { status: 400 }
    },
    {
      subject: 'fetch non-existent user',
      handler: api.usersId,
      params: { user_id: new ObjectId().toHexString() },
      method: 'GET',
      response: { status: 404 }
    },
    {
      subject: 'valid delete user',
      handler: api.usersId,
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
        };
      },
      method: 'DELETE',
      response: { status: 200 }
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
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
        };
      },
      method: 'GET',
      response: {
        status: 200,
        json: { user: expect.objectContaining({ deleted: true }) }
      }
    },
    {
      subject: 'delete deleted user (noop)',
      handler: api.usersId,
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
        };
      },
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
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id || tossError()
        };
      },
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
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id || tossError()
        };
      },
      method: 'PUT',
      body: { username: 'ewarren' },
      response: { status: 400 }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id || tossError()
        };
      },
      method: 'PUT',
      body: { email: 'test2@test.com' },
      response: { status: 400 }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id || tossError()
        };
      },
      method: 'PUT',
      body: { email: 'h@hillaryclinton.com' },
      response: { status: 400 }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id || tossError()
        };
      },
      method: 'PUT',
      body: { email: '555-666-7777' },
      response: { status: 400 }
    },
    {
      subject: 'get user like count',
      handler: api.usersId,
      params: ({ getResultAt }) => {
        return {
          user_id: getResultAt<{ user: PublicUser }>(4).json?.user.user_id || tossError()
        };
      },
      method: 'GET',
      response: {
        status: 200,
        json: {
          user: { liked: 0 }
        }
      }
    }
    // {
    //   subject: 'create new bark'
    // },
    // {
    //   subject: 'confirm metadata',
    //   handler: api.info,
    //   method: 'GET',
    //   response: {
    //     status: 200,
    //     json: { totalBarks: initialBarkCount + 1, totalUsers: initialUserCount + 2 }
    //   }
    // },
    // {
    //   subject: 'like new bark'
    // },
    // {
    //   subject: 'confirm user liked count'
    // },
    // {
    //   subject: 'confirm bark likes count'
    // },
    // {
    //   subject: 'get liked barks'
    // },
    // {
    //   subject: 'barks-is-liked endpoint 200s'
    // },
    // {
    //   subject: 'users-liked-bark endpoint 200s'
    // },
    // {
    //   subject: 'get users who liked bark'
    // },
    // {
    //   subject: 'unlike bark'
    // },
    // {
    //   subject: 'unlike unliked bark (noop)',
    //   handler: api.usersId,
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'DELETE',
    //   response: { status: 200 }
    // },
    // {
    //   subject: 'get users who liked bark'
    // },
    // {
    //   subject: 'barks-is-liked endpoint 404s'
    // },
    // {
    //   subject: 'users-liked-bark endpoint 404s'
    // },
    // {
    //   subject: 'confirm user liked count'
    // },
    // {
    //   subject: 'confirm bark likes counts'
    // },
    // {
    //   subject: 'get liked barks'
    // },
    // {
    //   subject: 'delete 11 barks'
    // },
    // {
    //   subject: 'get deleted bark',
    //   handler: api.usersId,
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'GET',
    //   response: {
    //     status: 200,
    //     json: { user: expect.objectContaining({ deleted: true }) }
    //   }
    // },
    // {
    //   subject: 'delete deleted bark (noop)',
    //   handler: api.usersId,
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'DELETE',
    //   response: { status: 200 }
    // },
    // {
    //   subject: 'confirm metadata',
    //   handler: api.info,
    //   method: 'GET',
    //   response: {
    //     status: 200,
    //     json: { totalBarks: initialBarkCount - 10, totalUsers: initialUserCount + 2 }
    //   }
    // },
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
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'DELETE',
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
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'DELETE',
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
    //   params: ({ getResultAt }) => {
    //     return {
    //       user_id: getResultAt<{ user: PublicUser }>(1).json?.user.user_id || tossError()
    //     };
    //   },
    //   method: 'DELETE',
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
}
