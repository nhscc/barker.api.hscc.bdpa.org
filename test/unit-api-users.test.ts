/* eslint-disable no-await-in-loop */
import { wrapHandler } from 'universe/backend/middleware';
import { testApiHandler } from 'next-test-api-route-handler';
import { ObjectId } from 'mongodb';

import {
  asMockedFunction,
  asMockedNextApiMiddleware,
  itemFactory
} from 'testverse/setup';

import {
  DUMMY_KEY as KEY,
  getUser,
  getAllUsers,
  getUserLikedBarkIds,
  getBarkLikesUserIds,
  getPackmateUserIds,
  getFollowingUserIds,
  getBookmarkedBarkIds,
  isUserFollowing,
  isUserPackmate,
  isBarkBookmarked,
  isBarkLiked,
  createUser
} from 'universe/backend';

import EndpointUsers, { config as ConfigUsers } from 'universe/pages/api/v1/users';
import EndpointUsersId, {
  config as ConfigUsersId
} from 'universe/pages/api/v1/users/[user_id]';
import EndpointUsersIdLiked, {
  config as ConfigUsersIdLiked
} from 'universe/pages/api/v1/users/[user_id]/liked';
import EndpointUsersIdLikedId, {
  config as ConfigUsersIdLikedId
} from 'universe/pages/api/v1/users/[user_id]/liked/[bark_id]';
import EndpointUsersIdFollowing, {
  config as ConfigUsersIdFollowing
} from 'universe/pages/api/v1/users/[user_id]/following';
import EndpointUsersIdFollowingId, {
  config as ConfigUsersIdFollowingId
} from 'universe/pages/api/v1/users/[user_id]/following/[followed_id]';
import EndpointUsersIdPack, {
  config as ConfigUsersIdPack
} from 'universe/pages/api/v1/users/[user_id]/pack';
import EndpointUsersIdPackId, {
  config as ConfigUsersIdPackId
} from 'universe/pages/api/v1/users/[user_id]/pack/[packmate_id]';
import EndpointUsersIdBookmarks, {
  config as ConfigUsersIdBookmarks
} from 'universe/pages/api/v1/users/[user_id]/bookmarks';
import EndpointUsersIdBookmarksId, {
  config as ConfigUsersIdBookmarksId
} from 'universe/pages/api/v1/users/[user_id]/bookmarks/[bark_id]';

import type { PublicUser } from 'types/global';

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const mockedGetUser = asMockedFunction(getUser);
const mockedGetAllUsers = asMockedFunction(getAllUsers);
const mockedGetUserLikedBarkIds = asMockedFunction(getUserLikedBarkIds);
const mockedGetBarkLikesUserIds = asMockedFunction(getBarkLikesUserIds);
const mockedGetPackmateUserIds = asMockedFunction(getPackmateUserIds);
const mockedGetFollowingUserIds = asMockedFunction(getFollowingUserIds);
const mockedGetBookmarkedBarkIds = asMockedFunction(getBookmarkedBarkIds);
const mockedIsUserFollowing = asMockedFunction(isUserFollowing);
const mockedIsUserPackmate = asMockedFunction(isUserPackmate);
const mockedIsBarkBookmarked = asMockedFunction(isBarkBookmarked);
const mockedIsBarkLiked = asMockedFunction(isBarkLiked);
const mockedCreateUser = asMockedFunction(createUser);

const api = {
  users: EndpointUsers as typeof EndpointUsers & { config?: typeof ConfigUsers },
  usersId: EndpointUsersId as typeof EndpointUsersId & {
    config?: typeof ConfigUsersId;
  },
  usersIdLiked: EndpointUsersIdLiked as typeof EndpointUsersIdLiked & {
    config?: typeof ConfigUsersIdLiked;
  },
  usersIdLikedId: EndpointUsersIdLikedId as typeof EndpointUsersIdLikedId & {
    config?: typeof ConfigUsersIdLikedId;
  },
  usersIdFollowing: EndpointUsersIdFollowing as typeof EndpointUsersIdFollowing & {
    config?: typeof ConfigUsersIdFollowing;
  },
  usersIdFollowingId: EndpointUsersIdFollowingId as typeof EndpointUsersIdFollowingId & {
    config?: typeof ConfigUsersIdFollowingId;
  },
  usersIdPack: EndpointUsersIdPack as typeof EndpointUsersIdPack & {
    config?: typeof ConfigUsersIdPack;
  },
  usersIdPackId: EndpointUsersIdPackId as typeof EndpointUsersIdPackId & {
    config?: typeof ConfigUsersIdPackId;
  },
  usersIdBookmarks: EndpointUsersIdBookmarks as typeof EndpointUsersIdBookmarks & {
    config?: typeof ConfigUsersIdBookmarks;
  },
  usersIdBookmarksId: EndpointUsersIdBookmarksId as typeof EndpointUsersIdBookmarksId & {
    config?: typeof ConfigUsersIdBookmarksId;
  }
};

api.users.config = ConfigUsers;
api.usersId.config = ConfigUsersId;
api.usersIdLiked.config = ConfigUsersIdLiked;
api.usersIdLikedId.config = ConfigUsersIdLikedId;
api.usersIdFollowing.config = ConfigUsersIdFollowing;
api.usersIdFollowingId.config = ConfigUsersIdFollowingId;
api.usersIdPack.config = ConfigUsersIdPack;
api.usersIdPackId.config = ConfigUsersIdPackId;
api.usersIdBookmarks.config = ConfigUsersIdBookmarks;
api.usersIdBookmarksId.config = ConfigUsersIdBookmarksId;

beforeEach(() => {
  asMockedNextApiMiddleware(wrapHandler);
  mockedGetUser.mockReturnValue(Promise.resolve({} as unknown as PublicUser));
  mockedGetAllUsers.mockReturnValue(Promise.resolve([]));
  mockedGetUserLikedBarkIds.mockReturnValue(Promise.resolve([]));
  mockedGetBarkLikesUserIds.mockReturnValue(Promise.resolve([]));
  mockedGetPackmateUserIds.mockReturnValue(Promise.resolve([]));
  mockedGetFollowingUserIds.mockReturnValue(Promise.resolve([]));
  mockedGetBookmarkedBarkIds.mockReturnValue(Promise.resolve([]));
  mockedIsUserFollowing.mockReturnValue(Promise.resolve(false));
  mockedIsUserPackmate.mockReturnValue(Promise.resolve(false));
  mockedIsBarkBookmarked.mockReturnValue(Promise.resolve(false));
  mockedIsBarkLiked.mockReturnValue(Promise.resolve(false));
  mockedCreateUser.mockReturnValue(Promise.resolve({} as unknown as PublicUser));
});

describe('api/v1/users', () => {
  describe('/ [GET]', () => {
    it('returns users', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.users,
        test: async ({ fetch }) => {
          const json = await fetch().then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        handler: api.users,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/ [POST]', () => {
    it('accepts a new user schema; returns a bark', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          expect(
            await fetch({
              method: 'POST',
              headers: { KEY, 'content-type': 'application/json' },
              body: JSON.stringify({})
            }).then(async (r) => [r.status, await r.json()])
          ).toStrictEqual([200, expect.objectContaining({ user: expect.anything() })]);
        }
      });
    });
  });

  describe('/:user_id [GET]', () => {
    it('accepts a user_id and returns a user; errors on invalid user_id', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        handler: api.usersId,
        test: async ({ fetch }) => {
          mockedGetUser.mockReturnValue(
            Promise.resolve({}) as ReturnType<typeof mockedGetUser>
          );

          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.user).toBeObject();
        }
      });

      await testApiHandler({
        params: { user_id: 'invalid' },
        handler: api.usersId,
        test: async ({ fetch }) =>
          expect(await fetch().then((r) => r.status)).toStrictEqual(400)
      });
    });
  });

  describe('/:user_id [DELETE]', () => {
    it('accepts a user_id; errors on invalid user_id', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: new ObjectId().toString() }, 200],
        [{ user_id: 'invalid-id' }, 400]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            mockedGetUser.mockReturnValue(
              Promise.resolve({}) as ReturnType<typeof mockedGetUser>
            );

            Object.assign(params, expectedParams);

            expect(
              await fetch({
                method: 'DELETE',
                ...(expectedStatus == 200 ? { headers: { KEY } } : {})
              }).then(async (r) => [r.status, await r.json()])
            ).toStrictEqual([
              expectedStatus,
              expect.objectContaining({ success: expectedStatus == 200 })
            ]);
          }
        }
      });
    });
  });

  describe('/:user_id [PUT]', () => {
    it('accepts a user_id and patch user; errors on invalid user_id', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: new ObjectId().toString() }, 200],
        [{ user_id: 'invalid-id' }, 400]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({
                method: 'PUT',
                headers: {
                  ...(expectedStatus == 200 ? { KEY } : {}),
                  'content-type': 'application/json'
                },
                body: JSON.stringify({})
              }).then(async (r) => [r.status, await r.json()])
            ).toStrictEqual([
              expectedStatus,
              expect.objectContaining({ success: expectedStatus == 200 })
            ]);
          }
        }
      });
    });
  });

  describe('/:user_id/liked [GET]', () => {
    it('accepts user_id and returns barks; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id' }, 400],
        [{ user_id: new ObjectId().toString() }, 200]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdLiked,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(
                async (r) => [r.status, await r.json()]
              )
            ).toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, barks: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdLiked,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.barks).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString() },
        handler: api.usersIdLiked,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/liked/:bark_id [GET]', () => {
    it('accepts bark_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsBarkLiked.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ bark_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ bark_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ bark_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            bark_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { bark_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdLikedId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toStrictEqual(expectedStatus);
          }
        }
      });
    });

    it('errors if the user has not liked the bark', async () => {
      expect.hasAssertions();

      mockedIsBarkLiked.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          bark_id: new ObjectId().toString(),
          user_id: new ObjectId().toString()
        },
        handler: api.usersIdLikedId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toStrictEqual(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/following [GET]', () => {
    it('accepts user_id and returns users; errors if invalid user_id given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id' }, 400],
        [{ user_id: new ObjectId().toString() }, 200]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFollowing,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(
                async (r) => [r.status, await r.json()]
              )
            ).toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, users: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination and includeIndirect flag', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdFollowing,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
          expect(mockedGetFollowingUserIds).toBeCalledWith(
            expect.objectContaining({ includeIndirect: false })
          );
        }
      });

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = '/?includeIndirect'),
        handler: api.usersIdFollowing,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
          expect(mockedGetFollowingUserIds).toBeCalledWith(
            expect.objectContaining({ includeIndirect: true })
          );
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString() },
        handler: api.usersIdFollowing,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/following/:followed_id [GET]', () => {
    it('accepts followed_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsUserFollowing.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ followed_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ followed_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ followed_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            followed_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { followed_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFollowingId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toStrictEqual(expectedStatus);
          }
        }
      });
    });

    it('errors if followed_id is not actually followed', async () => {
      expect.hasAssertions();

      mockedIsUserFollowing.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          followed_id: new ObjectId().toString(),
          user_id: new ObjectId().toString()
        },
        handler: api.usersIdFollowingId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toStrictEqual(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/following/:followed_id [DELETE]', () => {
    it('accepts followed_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ followed_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ followed_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ followed_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            followed_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { followed_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFollowingId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/following/:followed_id [PUT]', () => {
    it('accepts followed_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ followed_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ followed_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ followed_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            followed_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { followed_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFollowingId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/pack [GET]', () => {
    it('accepts user_id and returns users; errors if invalid user_id given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id' }, 400],
        [{ user_id: new ObjectId().toString() }, 200]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdPack,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(
                async (r) => [r.status, await r.json()]
              )
            ).toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, users: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdPack,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString() },
        handler: api.usersIdPack,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/pack/:packmate_id [GET]', () => {
    it('accepts packmate_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsUserPackmate.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ packmate_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ packmate_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ packmate_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            packmate_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { packmate_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdPackId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toStrictEqual(expectedStatus);
          }
        }
      });
    });

    it('errors if packmate_id does not belong to a packmate', async () => {
      expect.hasAssertions();

      mockedIsUserPackmate.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          packmate_id: new ObjectId().toString(),
          user_id: new ObjectId().toString()
        },
        handler: api.usersIdPackId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toStrictEqual(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/pack/:packmate_id [DELETE]', () => {
    it('accepts packmate_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ packmate_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ packmate_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ packmate_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            packmate_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { packmate_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdPackId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/pack/:packmate_id [PUT]', () => {
    it('accepts packmate_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ packmate_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ packmate_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ packmate_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            packmate_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { packmate_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdPackId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/bookmarks [GET]', () => {
    it('accepts user_id and returns barks; errors if invalid user_id given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id' }, 400],
        [{ user_id: new ObjectId().toString() }, 200]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdBookmarks,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(
                async (r) => [r.status, await r.json()]
              )
            ).toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, barks: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdBookmarks,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.barks).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString() },
        handler: api.usersIdBookmarks,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/bookmarks/:bark_id [GET]', () => {
    it('accepts bark_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsBarkBookmarked.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ bark_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ bark_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ bark_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            bark_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { bark_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdBookmarksId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toStrictEqual(expectedStatus);
          }
        }
      });
    });

    it('errors if bark_id does not belong to a packmate', async () => {
      expect.hasAssertions();

      mockedIsBarkBookmarked.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          bark_id: new ObjectId().toString(),
          user_id: new ObjectId().toString()
        },
        handler: api.usersIdBookmarksId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toStrictEqual(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/bookmarks/:bark_id [DELETE]', () => {
    it('accepts bark_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ bark_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ bark_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ bark_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            bark_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { bark_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdBookmarksId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/bookmarks/:bark_id [PUT]', () => {
    it('accepts bark_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ bark_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ bark_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ bark_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            bark_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { bark_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdBookmarksId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });
});
