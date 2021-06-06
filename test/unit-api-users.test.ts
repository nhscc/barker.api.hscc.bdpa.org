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
  getUsers,
  getUserLikedBarkIds,
  getBarkLikesUserIds,
  getPackmateUserIds,
  getFollowingUserIds,
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

import type { NewUser, PublicUser } from 'types/global';

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const mockedGetUser = asMockedFunction(getUser);
const mockedGetUsers = asMockedFunction(getUsers);
const mockedGetUserLikedBarkIds = asMockedFunction(getUserLikedBarkIds);
const mockedGetBarkLikesUserIds = asMockedFunction(getBarkLikesUserIds);
const mockedGetPackmateUserIds = asMockedFunction(getPackmateUserIds);
const mockedGetFollowingUserIds = asMockedFunction(getFollowingUserIds);
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
  mockedGetUsers.mockReturnValue(Promise.resolve([]));
  mockedGetUserLikedBarkIds.mockReturnValue(Promise.resolve([]));
  mockedGetBarkLikesUserIds.mockReturnValue(Promise.resolve([]));
  mockedGetPackmateUserIds.mockReturnValue(Promise.resolve([]));
  mockedGetFollowingUserIds.mockReturnValue(Promise.resolve([]));
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

          expect(json.success).toBe(true);
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

          expect(json.success).toBe(true);
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
          ).toStrictEqual([200, expect.objectContaining({ bark: expect.anything() })]);
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
        test: async ({ fetch }) => expect(await fetch().then((r) => r.status)).toBe(400)
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
                method: 'PUT',
                ...(expectedStatus == 200 ? { headers: { KEY } } : {})
              }).then(async (r) => [r.status, await r.json()])
            ).toBe([expectedStatus, { success: true }]);
          }
        }
      });
    });
  });

  describe('/:user_id [PUT]', () => {
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
            Object.assign(params, expectedParams);
            expect(
              await fetch(expectedStatus == 200 ? { method: 'PUT' } : {}).then(
                async (r) => [r.status, await r.json()]
              )
            ).toBe([expectedStatus, { success: true }]);
          }
        }
      });
    });
  });

  describe('/:user_id/liked [GET]', () => {
    it('accepts user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsBarkLiked.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ user_id: new ObjectId().toString() }, 200],
        [{ user_id: 'invalid-id' }, 400]
      ]);

      const params = { bark_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toBe(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/liked/:bark_id [GET]', () => {
    it('succeeds if the user has liked the bark', async () => {
      expect.hasAssertions();
    });

    it('errors if the user has not liked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/following [GET]', () => {
    it('returns expected users', async () => {
      expect.hasAssertions();
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/following/:followed_id [GET]', () => {
    it('succeeds if the user is a follower', async () => {
      expect.hasAssertions();
    });

    it('errors if the user is not a follower', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/following/:followed_id [DELETE]', () => {
    it('the user "unfollows" the formerly followed user', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the user is not a follower', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/following/:followed_id [PUT]', () => {
    it('the user "follows" the other user', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the user is already follower', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/pack [GET]', () => {
    it('returns expected users', async () => {
      expect.hasAssertions();
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/pack/:packmate_id [GET]', () => {
    it('succeeds if the user is a packmate', async () => {
      expect.hasAssertions();
    });

    it('errors if the user is not a packmate', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/pack/:packmate_id [DELETE]', () => {
    it('removes the target user from the pack', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the user is not a packmate', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/pack/:packmate_id [PUT]', () => {
    it('adds the target user to pack', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the user is already a packmate', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/bookmarks [GET]', () => {
    it('returns expected barks', async () => {
      expect.hasAssertions();
    });

    it('returns expected barks with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/bookmarks/:bark_id [GET]', () => {
    it('succeeds if the user has bookmarked the bark', async () => {
      expect.hasAssertions();
    });

    it('errors if the user has not bookmarked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/bookmarks/:bark_id [DELETE]', () => {
    it('the user "unbookmarks" the bark', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the bark already is not bookmarked', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:user_id/bookmarks/:bark_id [PUT]', () => {
    it('the user "bookmarks" the bark', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the bark is already bookmarked', async () => {
      expect.hasAssertions();
    });
  });
});
