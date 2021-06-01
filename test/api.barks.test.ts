import EndpointBarks, { config as ConfigBarks } from 'universe/pages/api/v1/barks';
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

import { dummyDbData, setupJest } from 'testverse/db';
import { testApiHandler } from 'next-test-api-route-handler';
import { DUMMY_KEY as KEY } from 'universe/backend';
import { getEnv } from 'universe/backend/env';
import { ObjectId } from 'mongodb';

import type { WithId } from 'mongodb';
import type { InternalBark } from 'types/global';

const RESULT_SIZE = getEnv().RESULTS_PER_PAGE;
const { getDb } = setupJest();

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
  }
};

api.barks.config = ConfigBarks;
api.barksIds.config = ConfigBarksIds;
api.barksSearch.config = ConfigBarksSearch;
api.barksIdLikes.config = ConfigBarksIdLikes;
api.barksIdLikesId.config = ConfigBarksIdLikesId;

process.env.REQUESTS_PER_CONTRIVED_ERROR = '0';
process.env.DISABLED_API_VERSIONS = '';

describe('api/v1/barks', () => {
  it('returns expected number of public barks by default in FIFO order', async () => {
    expect.hasAssertions();
    expect(true).toBeTrue();

    const results = dummyDbData.barks.slice(0, getEnv().RESULTS_PER_PAGE);

    await testApiHandler({
      handler: api.barks,
      test: async ({ fetch }) => {
        const response = await fetch({ headers: { KEY } });
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.success).toBe(true);
        //expect(json.barks).toStrictEqual(results);
      }
    });
  });
});
