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

import { dummyDbData, setupJest } from 'testverse/db';
import { testApiHandler } from 'next-test-api-route-handler';
import { DUMMY_KEY as KEY } from 'universe/backend';
import { getEnv } from 'universe/backend/env';
import { ObjectId } from 'mongodb';

import type { WithId } from 'mongodb';
import type { NewUser, PublicUser } from 'types/global';
import { ErrorJsonResponse } from 'multiverse/next-respond/types';

const RESULT_SIZE = getEnv().RESULTS_PER_PAGE;
const { getDb } = setupJest();

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

process.env.REQUESTS_PER_CONTRIVED_ERROR = '0';
process.env.DISABLED_API_VERSIONS = '';

describe('api/v1/users', () => {
  describe('/ [GET]', () => {
    it('returns expected users in LIFO order', async () => {
      expect.hasAssertions();

      const results = dummyDbData.users.slice(0, getEnv().RESULTS_PER_PAGE);

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.users).toStrictEqual(results);
        }
      });
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();

      process.env.RESULTS_PER_PAGE = '15';
      const results = dummyDbData.users.slice(2, 2 + getEnv().RESULTS_PER_PAGE);

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${dummyDbData.users[1]._id}`),
        handler: api.users,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.users).toStrictEqual(results);
        }
      });
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });

    it('does not throw when there are no users in the system', async () => {
      expect.hasAssertions();
    });
  });

  describe('/ [POST]', () => {
    it('creates and returns new users', async () => {
      expect.hasAssertions();

      const yieldItems: NewUser[] = [
        {
          owner: dummyDbData.users[0]._id,
          content: '1',
          private: false,
          barkbackTo: null,
          rebarkOf: null
        },
        {
          owner: new ObjectId(),
          content: '2',
          private: false,
          barkbackTo: null,
          rebarkOf: null
        },
        {
          owner: dummyDbData.users[0]._id,
          content: '3',
          private: false,
          barkbackTo: dummyDbData.users[0]._id,
          rebarkOf: null
        },
        {
          owner: dummyDbData.users[0]._id,
          content: '4',
          private: false,
          barkbackTo: null,
          rebarkOf: dummyDbData.users[0]._id
        },
        {
          owner: dummyDbData.users[0]._id,
          content: '5',
          private: true,
          barkbackTo: null,
          rebarkOf: null
        }
      ];

      const yieldCount = yieldItems.length;
      const getData = (function* () {
        yield yieldItems.shift();
      })();

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: yieldCount }).map((_) =>
              fetch({
                method: 'POST',
                headers: { KEY, 'content-type': 'application/json' },
                body: JSON.stringify(getData.next().value)
              }).then(async (r) => [r.status, (await r.json()).bark])
            )
          );

          expect(responses).toStrictEqual(
            Array.from({ length: yieldCount }).map((_, ndx) => [
              200,
              {
                ...yieldItems[ndx],
                user_id: expect.any(String),
                createdAt: expect.any(Number),
                likes: expect.any(Number),
                reusers: expect.any(Number),
                barkbacks: expect.any(Number),
                deleted: false
              } as PublicUser
            ])
          );
        }
      });

      it('system metadata is updated', async () => {
        expect.hasAssertions();
      });
    });

    it('errors if request body is invalid', async () => {
      expect.hasAssertions();

      const yieldCount = 11;
      const getInvalidData = (function* () {
        yield {};
        yield { data: 1 };
        yield { content: '', createdAt: Date.now() };
        yield {
          owner: '',
          content: '',
          private: false
        };
        yield {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false
        };
        yield {
          owner: dummyDbData.users[0]._id,
          content: '',
          private: false,
          barkbackTo: null,
          rebarkOf: null
        };
        yield {
          owner: new ObjectId(),
          content: 'xyz',
          private: false,
          barkbackTo: null,
          rebarkOf: null
        };
        yield {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false,
          barkbackTo: new ObjectId(),
          rebarkOf: null
        };
        yield {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false,
          barkbackTo: null,
          rebarkOf: new ObjectId()
        };
        yield {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false,
          barkbackTo: false,
          rebarkOf: null
        };
        yield {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false,
          barkbackTo: dummyDbData.users[0]._id,
          rebarkOf: dummyDbData.users[1]._id
        } as NewUser;
      })();

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: yieldCount }).map((_) =>
              fetch({
                method: 'POST',
                headers: { KEY, 'content-type': 'application/json' },
                body: JSON.stringify(getInvalidData.next().value)
              }).then((r) => r.status)
            )
          );

          expect(responses).toStrictEqual(
            Array.from({ length: yieldCount }).map((_) => 400)
          );
        }
      });
    });
  });

  describe('/<user_id> [GET]', () => {
    it('returns user by ID', async () => {
      expect.hasAssertions();
    });

    it('errors if ID not found', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id> [DELETE]', () => {
    it('deletes user by ID', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if ID not found', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id> [PUT]', () => {
    it('updates user by ID', async () => {
      expect.hasAssertions();
    });

    it('errors if ID not found', async () => {
      expect.hasAssertions();
    });

    it('errors if request body is invalid', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/liked [GET]', () => {
    it('returns expected barks in LIFO order', async () => {
      expect.hasAssertions();
    });

    it('returns expected barks with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/liked/<bark_id> [GET]', () => {
    it('succeeds if the user has liked the bark', async () => {
      expect.hasAssertions();
    });

    it('errors if the user has not liked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/following [GET]', () => {
    it('returns expected users in LIFO order', async () => {
      expect.hasAssertions();
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/following/<followed_id> [GET]', () => {
    it('succeeds if the user is a follower', async () => {
      expect.hasAssertions();
    });

    it('errors if the user is not a follower', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/following/<followed_id> [DELETE]', () => {
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

  describe('/<user_id>/following/<followed_id> [PUT]', () => {
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

  describe('/<user_id>/pack [GET]', () => {
    it('returns expected users in LIFO order', async () => {
      expect.hasAssertions();
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/pack/<packmate_id> [GET]', () => {
    it('succeeds if the user is a packmate', async () => {
      expect.hasAssertions();
    });

    it('errors if the user is not a packmate', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/pack/<packmate_id> [DELETE]', () => {
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

  describe('/<user_id>/pack/<packmate_id> [PUT]', () => {
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

  describe('/<user_id>/bookmarks [GET]', () => {
    it('returns expected barks in LIFO order', async () => {
      expect.hasAssertions();
    });

    it('returns expected barks with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/bookmarks/<bark_id> [GET]', () => {
    it('succeeds if the user has bookmarked the bark', async () => {
      expect.hasAssertions();
    });

    it('errors if the user has not bookmarked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<user_id>/bookmarks/<bark_id> [DELETE]', () => {
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

  describe('/<user_id>/bookmarks/<bark_id> [PUT]', () => {
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
