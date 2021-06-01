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

import { InternalInfo, NewBark, PublicBark } from 'types/global';
import { ErrorJsonResponse, SuccessJsonResponse } from 'multiverse/next-respond/types';

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

      const genUrl = (function* () {
        yield `/?after=-5`;
        yield `/?after=a`;
        yield `/?after=@($)`;
        yield `/?after=xyz`;
        yield `/?after=123`;
        yield `/?after=(*$)`;
        yield `/?dne=123`;
      })();

      await testApiHandler({
        requestPatcher: (req) => (req.url = genUrl.next().value || undefined),
        handler: api.barks,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: 7 }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([400, 400, 400, 400, 400, 400, 200]);
        }
      });
    });

    it('functions when no barks in the system', async () => {
      expect.hasAssertions();

      await (await getDb()).collection('barks').deleteMany({});

      await testApiHandler({
        handler: api.barks,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect((await response.json()).success).toBe(true);
          expect(json.barks).toStrictEqual([]);
        }
      });
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
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.barks,
        test: async ({ fetch }) => {
          await fetch({
            method: 'POST',
            headers: { KEY, 'content-type': 'application/json' },
            body: JSON.stringify({
              owner: dummyDbData.users[0]._id,
              content: '1',
              private: false,
              barkbackTo: null,
              rebarkOf: null
            })
          });

          expect(await (await getDb()).collection('info').findOne({})).toStrictEqual(
            expect.objectContaining({ totalBarks: dummyDbData.info.totalBarks + 1 })
          );
        }
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
    it('returns one or many Barks by ID', async () => {
      expect.hasAssertions();

      const yieldItems = [
        [dummyDbData.barks[0]._id],
        [dummyDbData.barks[99]._id],
        [dummyDbData.barks[5]._id, dummyDbData.barks[50]._id],
        dummyDbData.barks.slice(0, 50).map((b) => b._id),
        dummyDbData.barks.slice(45, 95).map((b) => b._id)
      ];
      const yieldCount = yieldItems.length;
      const genParams = (function* () {
        yield yieldItems.shift();
      })();

      const params = { bark_ids: genParams.next().value };

      await testApiHandler({
        params,
        handler: api.barksIds,
        test: async ({ fetch }) => {
          const responses = await Promise.all<
            SuccessJsonResponse & { barks: PublicBark[] }
          >(
            Array.from({ length: yieldCount }).map(async () => {
              const result = await fetch({ headers: { KEY } }).then((r) =>
                r.ok ? r.json() : null
              );
              params.bark_ids = genParams.next().value;
              return result;
            })
          );

          expect(responses.some((o) => !o?.success)).toBeFalse();

          expect(
            responses.map((r) => r.barks.map((b) => b.bark_id))
          ).toIncludeSameMembers(yieldItems);
        }
      });
    });

    it('errors if one or more IDs not found', async () => {
      expect.hasAssertions();

      const yieldItems = [
        [new ObjectId().toHexString()],
        [dummyDbData.barks[99]._id, new ObjectId().toHexString()]
      ];
      const yieldCount = yieldItems.length;
      const genParams = (function* () {
        yield yieldItems.shift();
      })();

      const params = { bark_ids: genParams.next().value };

      await testApiHandler({
        params,
        handler: api.barksIds,
        test: async ({ fetch }) => {
          const responses = await Promise.all<
            SuccessJsonResponse & { barks: PublicBark[] }
          >(
            Array.from({ length: yieldCount }).map(async () => {
              const result = await fetch({ headers: { KEY } }).then((r) => r.json());
              params.bark_ids = genParams.next().value;
              return result;
            })
          );

          expect(responses.some((o) => o?.success)).toBeFalse();
        }
      });
    });
  });

  describe('/<bark_id1>/<bark_id2>/<...>/<bark_idN> [DELETE]', () => {
    it('deletes one or more barks', async () => {
      expect.hasAssertions();

      const yieldItems = [
        [dummyDbData.barks[0]._id],
        [dummyDbData.barks[99]._id],
        [dummyDbData.barks[5]._id, dummyDbData.barks[50]._id],
        dummyDbData.barks.slice(45, 95).map((b) => b._id)
      ];
      const yieldCount = yieldItems.length;
      const genParams = (function* () {
        yield yieldItems.shift();
      })();

      const params = { bark_ids: genParams.next().value };

      await testApiHandler({
        params,
        handler: api.barksIds,
        test: async ({ fetch }) => {
          const responses = await Promise.all<
            SuccessJsonResponse & { barks: PublicBark[] }
          >(
            Array.from({ length: yieldCount }).map(async () => {
              const result = await fetch({ method: 'DELETE', headers: { KEY } }).then(
                (r) => (r.ok ? r.json() : null)
              );
              params.bark_ids = genParams.next().value;
              return result;
            })
          );

          expect(responses.some((o) => !o?.success)).toBeFalse();

          expect(
            await (
              await getDb()
            )
              .collection('barks')
              .aggregate([
                { $match: { _id: { $in: yieldItems.flat() } } },
                { $project: { deleted: 1 } }
              ])
              .toArray()
          ).toStrictEqual(
            Array.from({ length: yieldCount }).map((_) =>
              expect.objectContaining({ deleted: true })
            )
          );

          expect(
            await (
              await getDb()
            )
              .collection('barks')
              .aggregate([
                { $match: { _id: dummyDbData.barks[1]._id } },
                { $project: { deleted: 1 } }
              ])
              .toArray()
          ).toStrictEqual(expect.objectContaining({ deleted: false }));
        }
      });
    });

    it('system metadata is updated', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { bark_ids: [dummyDbData.barks[0]._id] },
        handler: api.barksIds,
        test: async ({ fetch }) => {
          await fetch({ method: 'DELETE', headers: { KEY } });

          expect(await (await getDb()).collection('info').findOne({})).toStrictEqual(
            expect.objectContaining({ totalBarks: dummyDbData.info.totalBarks - 1 })
          );
        }
      });
    });

    it('does not error if one or more IDs not found', async () => {
      expect.hasAssertions();

      const yieldItems = [
        [new ObjectId().toHexString()],
        [dummyDbData.barks[99]._id, new ObjectId().toHexString()]
      ];
      const yieldCount = yieldItems.length;
      const genParams = (function* () {
        yield yieldItems.shift();
      })();

      const params = { bark_ids: genParams.next().value };

      await testApiHandler({
        params,
        handler: api.barksIds,
        test: async ({ fetch }) => {
          const responses = await Promise.all<
            SuccessJsonResponse & { barks: PublicBark[] }
          >(
            Array.from({ length: yieldCount }).map(async () => {
              const result = await fetch({ headers: { KEY } }).then((r) => r.json());
              params.bark_ids = genParams.next().value;
              return result;
            })
          );

          expect(responses.some((o) => !o?.success)).toBeFalse();
        }
      });
    });
  });

  describe('/:bark_id/likes [GET]', () => {
    it('returns expected users in LIFO order', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id },
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.users).toStrictEqual(
            targetBark.likes.map((id) => id.toHexString()).reverse()
          );
        }
      });
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];
      const targetBarkLikes = [
        ...targetBark.likes,
        ...Array.from({ length: 115 }).map(() => new ObjectId())
      ];

      await (await getDb()).collection('barks').updateOne(
        { _id: targetBark._id },
        {
          $push: {
            likes: { $each: targetBarkLikes }
          }
        }
      );

      await testApiHandler({
        params: { bark_id: targetBark._id },
        requestPatcher: (req) => (req.url = `/?after=${targetBarkLikes[10]}`),
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.barks).toStrictEqual(
            targetBarkLikes.slice(10, getEnv().RESULTS_PER_PAGE + 10)
          );
        }
      });
    });

    it('does the right thing when garbage offsets are provided', async () => {
      expect.hasAssertions();

      const genUrl = (function* () {
        yield `/?after=-5`;
        yield `/?after=a`;
        yield `/?after=@($)`;
        yield `/?after=xyz`;
        yield `/?after=123`;
        yield `/?after=(*$)`;
        yield `/?dne=123`;
      })();

      await testApiHandler({
        params: { bark_id: dummyDbData.barks[0]._id },
        requestPatcher: (req) => (req.url = genUrl.next().value || undefined),
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: 7 }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([400, 400, 400, 400, 400, 400, 200]);
        }
      });
    });

    it('functions when bark has no likes', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await (await getDb())
        .collection('barks')
        .updateOne({ _id: targetBark._id }, { $set: { likes: [] } });

      await testApiHandler({
        params: { bark_id: targetBark._id },
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.barks).toStrictEqual([]);
        }
      });
    });
  });

  describe('/:bark_id/likes/:user_id [GET]', () => {
    it('succeeds if the user has liked the bark', async () => {
      expect.hasAssertions();
    });

    it('errors if the user has not liked the bark', async () => {
      expect.hasAssertions();
    });
  });

  describe('/:bark_id/likes/:user_id [DELETE]', () => {
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

  describe('/:bark_id/likes/:user_id [PUT]', () => {
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

    it('functions when there are no barks in the system', async () => {
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
