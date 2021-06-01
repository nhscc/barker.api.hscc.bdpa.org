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

import type { NewBark, PublicBark } from 'types/global';
import { ErrorJsonResponse } from 'multiverse/next-respond/types';

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
  describe('/ [GET]', () => {
    it('returns expected bark in LIFO order', async () => {
      expect.hasAssertions();

      const results = dummyDbData.barks.slice(0, getEnv().RESULTS_PER_PAGE);

      await testApiHandler({
        handler: api.barks,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.barks).toStrictEqual(results);
        }
      });
    });

    it('returns expected bark with respect to offset', async () => {
      expect.hasAssertions();

      process.env.RESULTS_PER_PAGE = '15';
      const results = dummyDbData.barks.slice(2, 2 + getEnv().RESULTS_PER_PAGE);

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${dummyDbData.barks[1]._id}`),
        handler: api.barks,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.barks).toStrictEqual(results);
        }
      });
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });

    it('does not throw when no barks in the system', async () => {
      expect.hasAssertions();
    });
  });

  describe('/ [POST]', () => {
    it('creates and returns new barks', async () => {
      expect.hasAssertions();

      const yieldItems: NewBark[] = [
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
          barkbackTo: dummyDbData.barks[0]._id,
          rebarkOf: null
        },
        {
          owner: dummyDbData.users[0]._id,
          content: '4',
          private: false,
          barkbackTo: null,
          rebarkOf: dummyDbData.barks[0]._id
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
        handler: api.barks,
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
                bark_id: expect.any(String),
                createdAt: expect.any(Number),
                likes: expect.any(Number),
                rebarks: expect.any(Number),
                barkbacks: expect.any(Number),
                deleted: false
              } as PublicBark
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
          barkbackTo: dummyDbData.barks[0]._id,
          rebarkOf: dummyDbData.barks[1]._id
        } as NewBark;
      })();

      await testApiHandler({
        handler: api.barks,
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

  describe('/<bark_id1>/<bark_id2>/<...>/<bark_idN> [GET]', () => {
    it('returns one Bark by ID', async () => {
      expect.hasAssertions();
    });

    it('returns many barks by ID', async () => {
      expect.hasAssertions();
    });

    it('errors if one or more IDs not found', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<bark_id1>/<bark_id2>/<...>/<bark_idN> [DELETE]', () => {
    it('deletes one or more barks', async () => {
      expect.hasAssertions();
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if one or more IDs not found', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<bark_id>/likes [GET]', () => {
    it('returns expected users in LIFO order', async () => {
      expect.hasAssertions();
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });

    it('does not throw when bark has no likes', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<bark_id>/likes/<user_id> [GET]', () => {
    it('succeeds if the user has liked the bark', async () => {
      expect.hasAssertions();
    });

    it('errors if the user has not liked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<bark_id>/likes/<user_id> [DELETE]', () => {
    it('the user "unlikes" the bark', async () => {
      expect.hasAssertions();
    });

    it('system metadata (bark and user) is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the user has not liked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/<bark_id>/likes/<user_id> [PUT]', () => {
    it('the user "likes" the bark', async () => {
      expect.hasAssertions();
    });

    it('system metadata (bark and user) is updated', async () => {
      expect.hasAssertions();
    });

    it('does not error if the user has already liked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/search [GET]', () => {
    it('returns expected barks in LIFO order with respect to offset', async () => {
      expect.hasAssertions();
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();
    });

    it('does not throw when there are no barks in the system', async () => {
      expect.hasAssertions();
    });

    it('returns same barks as GET /barks if no query params given', async () => {
      expect.hasAssertions();
    });

    it('returns expected barks with respect to match', async () => {
      expect.hasAssertions();
    });

    it('returns expected barks with respect to regexMatch', async () => {
      expect.hasAssertions();
    });

    it('regexMatch errors properly with bad inputs', async () => {
      expect.hasAssertions();
    });

    it('ensure meta, totalLikes/totalRebarks/totalBarkbacks (unproxied), likes (non-numeric), and bark_id/_id cannot be matched against', async () => {
      expect.hasAssertions();
    });

    it('ensure numerical matches against likes (totalLikes), rebarks (totalRebarks), and barkbacks (totalBarkbacks) are properly proxied', async () => {
      expect.hasAssertions();
    });

    it('returns expected barks with respect to all possible query params simultaneously', async () => {
      expect.hasAssertions();
    });
  });
});
