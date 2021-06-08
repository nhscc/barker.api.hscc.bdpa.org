import { testApiHandler } from 'next-test-api-route-handler';
import { mockEnvFactory } from 'testverse/setup';
import { dummyDbData, setupTestDb } from 'testverse/db';
import { DUMMY_KEY as KEY } from 'universe/backend';

import EndpointBarks, { config as ConfigBarks } from 'universe/pages/api/v1/barks';
import EndpointUsers, { config as ConfigUsers } from 'universe/pages/api/v1/users';
import EndpointInfo, { config as ConfigInfo } from 'universe/pages/api/v1/info';

import EndpointBarksIds, {
  config as ConfigBarksIds
} from 'universe/pages/api/v1/barks/[...bark_ids]';

import EndpointBarksSearch, {
  config as ConfigBarksSearch
} from 'universe/pages/api/v1/barks/search';

import EndpointBarksIdLikes, {
  config as ConfigBarksIdLikes
} from 'universe/pages/api/v1/barks/[bark_id]/likes';

import EndpointBarksIdLikesId, {
  config as ConfigBarksIdLikesId
} from 'universe/pages/api/v1/barks/[bark_id]/likes/[user_id]';

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

import type { NewUser, PatchUser, NewBark } from 'types/global';
import type { IncomingMessage } from 'http';

// ? Setup and hydrate the in-memory mongo instance (we're gonna need it)
setupTestDb();

const api = {
  barks: EndpointBarks as typeof EndpointBarks & { config?: typeof ConfigBarks },
  barksIds: EndpointBarksIds as typeof EndpointBarksIds & {
    config?: typeof ConfigBarksIds;
  },
  barksSearch: EndpointBarksSearch as typeof EndpointBarksSearch & {
    config?: typeof ConfigBarksSearch;
  },
  barksIdLikes: EndpointBarksIdLikes as typeof EndpointBarksIdLikes & {
    config?: typeof ConfigBarksIdLikes;
  },
  barksIdLikesId: EndpointBarksIdLikesId as typeof EndpointBarksIdLikesId & {
    config?: typeof ConfigBarksIdLikesId;
  },
  info: EndpointInfo as typeof EndpointInfo & { config?: typeof ConfigInfo },
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

api.barks.config = ConfigBarks;
api.barksIds.config = ConfigBarksIds;
api.barksSearch.config = ConfigBarksSearch;
api.barksIdLikes.config = ConfigBarksIdLikes;
api.barksIdLikesId.config = ConfigBarksIdLikesId;
api.info.config = ConfigInfo;

const withMockedEnv = mockEnvFactory({}, { replace: false });

const createRequestPatcher =
  (uri = '/') =>
  (req: IncomingMessage) => {
    req.url = uri;
    req.headers = { KEY };
  };

describe('generic correctness tests', () => {
  test.todo('all endpoints fail on bad authentication');
  test.todo('server sends HTTP 555 on cue');
  void withMockedEnv as unknown as NewUser | PatchUser | NewBark; // TODO: delete line
});

// TODO: replace NTARH with the latest version (with multi-handler DRY support)
// TODO: LIFO, 400/404, ignore 555
test('create and validate, update and validate, query for, and delete users', async () => {
  expect.hasAssertions();

  const memory = {
    totalBarks: dummyDbData.barks.length,
    totalUsers: dummyDbData.users.length
  };

  await testApiHandler({
    requestPatcher: createRequestPatcher(),
    handler: api.info,
    test: async ({ fetch }) => {
      expect(await fetch().then((r) => r.json())).toStrictEqual({
        totalBarks: memory.totalBarks,
        totalUsers: memory.totalUsers
      });
    }
  });
});

// TODO: LIFO, 400/404, ignore 555
test('create and validate, delete, and query many public/private barks/barkbacks/rebarks', async () => {
  expect.hasAssertions();
});

// TODO: LIFO, 400/404, ignore 555
test('like/unlike and bookmark/unbookmark barks', async () => {
  expect.hasAssertions();
});

// TODO: LIFO, 400/404, ignore 555
test('users follow/unfollow and pack/unpack one other', async () => {
  expect.hasAssertions();
});

// TODO: LIFO, 400/404, ignore 555
test('versatile search capability', async () => {
  expect.hasAssertions();
});
