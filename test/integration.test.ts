import { testApiHandler } from 'next-test-api-route-handler';
import { mockEnvFactory } from 'testverse/setup';
import { setupTestDb } from 'testverse/db';
import { getFixtures } from 'testverse/integration.fixtures';
import { DUMMY_KEY } from 'universe/backend';
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

import type {
  NextApiHandlerMixin,
  TestResultset,
  TestResult
} from 'testverse/integration.fixtures';

// ? Setup and hydrate the in-memory mongo instance (we're gonna need it)
setupTestDb(true);

const api = {
  info: EndpointInfo as NextApiHandlerMixin,
  barks: EndpointBarks as NextApiHandlerMixin,
  barksIds: EndpointBarksIds as NextApiHandlerMixin,
  barksSearch: EndpointBarksSearch as NextApiHandlerMixin,
  barksIdLikes: EndpointBarksIdLikes as NextApiHandlerMixin,
  barksIdLikesId: EndpointBarksIdLikesId as NextApiHandlerMixin,
  users: EndpointUsers as NextApiHandlerMixin,
  usersId: EndpointUsersId as NextApiHandlerMixin,
  usersIdLiked: EndpointUsersIdLiked as NextApiHandlerMixin,
  usersIdLikedId: EndpointUsersIdLikedId as NextApiHandlerMixin,
  usersIdFollowing: EndpointUsersIdFollowing as NextApiHandlerMixin,
  usersIdFollowingId: EndpointUsersIdFollowingId as NextApiHandlerMixin,
  usersIdPack: EndpointUsersIdPack as NextApiHandlerMixin,
  usersIdPackId: EndpointUsersIdPackId as NextApiHandlerMixin,
  usersIdBookmarks: EndpointUsersIdBookmarks as NextApiHandlerMixin,
  usersIdBookmarksId: EndpointUsersIdBookmarksId as NextApiHandlerMixin
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

api.users.url = '/users';
api.usersId.url = '/users/:user_id';
api.usersIdLiked.url = '/users/:user_id/liked';
api.usersIdLikedId.url = '/users/:user_id/liked/:bark_id';
api.usersIdFollowing.url = '/users/:user_id/following';
api.usersIdFollowingId.url = '/users/:user_id/following/:followed_id';
api.usersIdPack.url = '/users/:user_id/pack';
api.usersIdPackId.url = '/users/:user_id/pack/:packmate_id';
api.usersIdBookmarks.url = '/users/:user_id/bookmarks';
api.usersIdBookmarksId.url = '/users/:user_id/bookmarks/:bark_id';
api.barks.url = '/barks';
api.barksIds.url = '/barks/:bark_id1/:bark_id2/.../:bark_idN';
api.barksSearch.url = '/barks/search';
api.barksIdLikes.url = '/barks/:bark_id/likes';
api.barksIdLikesId.url = '/barks/:bark_id/likes/:user_id';
api.info.url = '/info';

const withMockedEnv = mockEnvFactory({}, { replace: false });

// ? Memory of the results of past fixture runs.
const memory: TestResultset = [
  { status: Infinity, json: {} }
] as unknown as TestResultset;

memory.latest = memory[0];
memory.getResultAt = () => memory[0];

// ? Fail fast and fail early
let lastRunSuccess = true;

describe('generic correctness tests', () => {
  test.todo('all endpoints fail on bad authentication');
  test.todo('server sends HTTP 555 at proper cadence');
});

getFixtures(api).forEach(async (expected, ndx) => {
  // eslint-disable-next-line jest/prefer-expect-assertions
  it(`#${ndx + 1} ${expected.handler.url} [${expected.method}]`, async () => {
    if (!lastRunSuccess) return;

    expect.hasAssertions();
    lastRunSuccess = false;

    memory.getResultAt = (index: number) => memory[1 + index + (index < 0 ? ndx : 0)];

    const requestParams =
      typeof expected.params == 'function' ? expected.params(memory) : expected.params;

    const requestBody =
      typeof expected.body == 'function' ? expected.body(memory) : expected.body;

    const expectedStatus =
      typeof expected.response.status == 'function'
        ? expected.response.status(memory)
        : expected.response.status;

    const expectedJson =
      typeof expected.response.json == 'function'
        ? expected.response.json(memory)
        : expected.response.json;

    await withMockedEnv(
      async () => {
        await testApiHandler({
          handler: expected.handler,
          params: requestParams,
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          test: async ({ fetch }) => {
            const res = await fetch({
              method: expected.method,
              ...(requestBody
                ? {
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(requestBody)
                  }
                : {})
            });

            const json = await res.json();
            if (res.status != expectedStatus) {
              // eslint-disable-next-line no-console
              console.warn('unexpected status for result:', json);
            }

            expect(res.status).toBe(expectedStatus);
            expect(json.success)[res.status == 200 ? 'toBeTrue' : 'toBeFalsy']();

            delete json.success;
            expect(json).toStrictEqual(expectedJson);

            const memorize = { status: res.status, json } as TestResult;
            memory.push(memorize);
            memory.latest = memorize;

            lastRunSuccess = true;
          }
        });
      },
      {
        REQUESTS_PER_CONTRIVED_ERROR: '10',
        IGNORE_RATE_LIMITS: 'true'
      }
    );
  });
});
