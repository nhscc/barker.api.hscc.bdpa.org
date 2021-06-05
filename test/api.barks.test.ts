/* eslint-disable no-await-in-loop */
import { getEnv } from 'universe/backend/env';
import { wrapHandler } from 'universe/backend/middleware';
import { dummyDbData, setupJest } from 'testverse/db';
import { asMockedFunction, itemFactory } from 'testverse/setup';
import { testApiHandler } from 'next-test-api-route-handler';
import { ObjectId } from 'mongodb';

import {
  DUMMY_KEY as KEY,
  getBarks,
  deleteBarks,
  getBarkLikesUserIds,
  isBarkLiked,
  searchBarks,
  createBark
} from 'universe/backend';

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

import type { PublicBark } from 'types/global';
import { sendNotImplementedError } from 'multiverse/next-respond';

process.env.REQUESTS_PER_CONTRIVED_ERROR = '0';
process.env.DISABLED_API_VERSIONS = '';

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const mockedGetBarks = asMockedFunction(getBarks);
const mockedDeleteBarks = asMockedFunction(deleteBarks);
const mockedGetBarkLikesUserIds = asMockedFunction(getBarkLikesUserIds);
const mockedIsBarkLiked = asMockedFunction(isBarkLiked);
const mockedSearchBarks = asMockedFunction(searchBarks);
const mockedCreateBark = asMockedFunction(createBark);

setupJest();

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

beforeEach(() => {
  asMockedFunction(wrapHandler).mockImplementation(async (fn, { req, res }) => {
    const spy = jest.spyOn(res, 'send');

    try {
      fn && (await fn({ req, res }));
    } finally {
      // ! This must happen or jest tests will hang and mongomemserv will choke.
      // ! Also note that this isn't a NextApiResponse but a ServerResponse!
      if (!spy.mock.calls.length) sendNotImplementedError(res);
    }
  });

  mockedIsBarkLiked.mockReturnValue(Promise.resolve(false));
  mockedGetBarks.mockReturnValue(Promise.resolve([]));
  mockedGetBarkLikesUserIds.mockReturnValue(Promise.resolve([]));
  mockedSearchBarks.mockReturnValue(Promise.resolve([]));
  mockedCreateBark.mockReturnValue(Promise.resolve({} as unknown as PublicBark));
});

describe('api/v1/barks', () => {
  describe('/ [GET]', () => {
    it('returns expected bark', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.barks,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBe(true);
          expect(json.barks).toBeArray();
          expect(mockedSearchBarks).toBeCalled();
        }
      });
    });

    it('returns expected bark with respect to offset', async () => {
      expect.hasAssertions();
      process.env.RESULTS_PER_PAGE = '15';

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${dummyDbData.barks[1]._id}`),
        handler: api.barks,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBe(true);
          expect(json.barks).toBeArray();
          expect(mockedSearchBarks).toBeCalledWith(
            expect.objectContaining({ after: expect.anything() })
          );
        }
      });
    });

    it('does the right thing when garbage offsets are provided', async () => {
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
        handler: api.barks,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: 6 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/ [POST]', () => {
    it('creates and returns new barks', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.barks,
        test: async ({ fetch }) => {
          expect(
            await fetch({
              method: 'POST',
              headers: { KEY, 'content-type': 'application/json' },
              body: JSON.stringify({})
            }).then(async (r) => [r.status, await r.json()])
          ).toStrictEqual([200, expect.objectContaining({ bark: expect.anything() })]);
          expect(mockedCreateBark).toBeCalled();
        }
      });
    });
  });

  describe('/:bark_id1/:bark_id2/.../:bark_idN [GET]', () => {
    it('returns one or many Barks by ID', async () => {
      expect.hasAssertions();

      const items = [
        [dummyDbData.barks[0]._id],
        [dummyDbData.barks[5]._id, dummyDbData.barks[50]._id],
        dummyDbData.barks.slice(0, 50).map((b) => b._id)
      ];

      const params = { bark_ids: [] as ObjectId[] };

      await testApiHandler({
        params,
        handler: api.barksIds,
        test: async ({ fetch }) => {
          // ? fetch is async, so to use params we need to wait
          // TODO: fix w/ paramsPatcher
          for (const item of items) {
            params.bark_ids = item;

            mockedGetBarks.mockReturnValue(
              Promise.resolve(params.bark_ids) as unknown as ReturnType<
                typeof mockedGetBarks
              >
            );

            const result = await fetch({ headers: { KEY } }).then((r) => r.json());

            expect(result?.success).toBeTrue();
            expect(result.barks).toStrictEqual(
              params.bark_ids.map((id) => id.toString())
            );
          }
        }
      });
    });

    it('errors on bad results from getBarks', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { bark_ids: [dummyDbData.barks[99]._id] },
        handler: api.barksIds,
        test: async ({ fetch }) => {
          mockedGetBarks.mockReturnValue(
            Promise.resolve([]) as unknown as ReturnType<typeof mockedGetBarks>
          );

          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toBe(404);
        }
      });
    });

    it('errors if invalid IDs given', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { bark_ids: ['invalid-id'] },
        handler: api.barksIds,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toBe(400);
        }
      });
    });
  });

  describe('/:bark_id1/:bark_id2/.../:bark_idN [DELETE]', () => {
    it('deletes one or more barks ignoring not found and duplicate bark_ids', async () => {
      expect.hasAssertions();

      const items = [
        [dummyDbData.barks[0]._id],
        [dummyDbData.barks[5]._id, dummyDbData.barks[5]._id],
        dummyDbData.barks.slice(0, 50).map((b) => b._id),
        [new ObjectId()],
        [new ObjectId(), dummyDbData.barks[0]._id]
      ];

      const params = { bark_ids: [] as ObjectId[] };

      await testApiHandler({
        params,
        handler: api.barksIds,
        test: async ({ fetch }) => {
          // ? fetch is async, so to use params we need to wait
          // TODO: fix w/ paramsPatcher
          for (const item of items) {
            params.bark_ids = item;

            const json = await fetch({ method: 'DELETE', headers: { KEY } }).then((r) =>
              r.json()
            );

            expect(json.success).toBe(true);
            expect(mockedDeleteBarks).toBeCalled();
          }
        }
      });
    });

    it('errors if invalid IDs given', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { bark_ids: ['invalid-id'] },
        handler: api.barksIds,
        test: async ({ fetch }) => {
          expect(
            await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
          ).toBe(400);
        }
      });
    });
  });

  describe('/:bark_id/likes [GET]', () => {
    it('returns expected users', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id.toString() },
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBe(true);
          expect(json.users).toBeArray();
        }
      });
    });

    it('returns expected users with respect to offset', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id.toString() },
        requestPatcher: (req) => (req.url = `/?after=${targetBark._id}`),
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBe(true);
          expect(json.users).toBeArray();
          expect(mockedGetBarkLikesUserIds).toBeCalledWith(
            expect.objectContaining({ after: expect.anything() })
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
        params: { bark_id: dummyDbData.barks[0]._id.toString() },
        requestPatcher: (req) => (req.url = genUrl.next().value || undefined),
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: 7 }).map(async (_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: 6 }).map(() => 400),
            200
          ]);
        }
      });
    });

    it('functions when bark has no likes', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id },
        handler: api.barksIdLikes,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBe(true);
          expect(json.users).toStrictEqual([]);
        }
      });
    });
  });

  describe('/:bark_id/likes/:user_id [GET]', () => {
    it('succeeds if the user has liked the bark', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];
      mockedIsBarkLiked.mockReturnValue(Promise.resolve(true));

      await testApiHandler({
        params: {
          bark_id: targetBark._id.toString(),
          user_id: targetBark.likes[0].toString()
        },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toBe(200);
        }
      });
    });

    it('errors if the user has not liked the bark', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: {
          bark_id: targetBark._id.toString(),
          user_id: new ObjectId().toString()
        },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toBe(404);
        }
      });
    });
  });

  describe('/:bark_id/likes/:user_id [DELETE]', () => {
    it('accepts bark_id, user_id, and method; responds as expected', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id, user_id: targetBark.likes[0] },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          await fetch({ method: 'DELETE', headers: { KEY } });

          expect(
            await (await getDb()).collection('barks').findOne({ _id: targetBark._id })
          ).toStrictEqual(
            expect.objectContaining({
              bark_id: targetBark._id,
              likes: expect.not.arrayContaining([targetBark.likes[0]])
            })
          );
        }
      });
    });

    it('system metadata (bark and user) is updated', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id, user_id: targetBark.likes[0] },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          await fetch({ method: 'DELETE', headers: { KEY } });

          expect(
            await (await getDb()).collection('barks').findOne({ _id: targetBark._id })
          ).toStrictEqual(
            expect.objectContaining({
              bark_id: targetBark._id,
              likes: expect.not.arrayContaining([targetBark.likes[0]])
            })
          );

          expect(
            await (await getDb())
              .collection('users')
              .findOne({ _id: targetBark.likes[0] })
          ).toStrictEqual(
            expect.objectContaining({
              user_id: targetBark.likes[0],
              liked: expect.not.arrayContaining([targetBark._id])
            })
          );
        }
      });
    });

    it('does not error if the user has not liked the bark', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[99];

      expect(dummyDbData.users[0].liked).not.toContain(targetBark._id);

      await testApiHandler({
        params: { bark_id: targetBark._id, user_id: dummyDbData.users[0]._id },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          expect((await fetch({ method: 'DELETE', headers: { KEY } })).status).toBe(200);
        }
      });
    });
  });

  describe('/:bark_id/likes/:user_id [PUT]', () => {
    it('the user "likes" the bark', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[99];

      expect(dummyDbData.users[0].liked).not.toContain(targetBark._id);

      await testApiHandler({
        params: { bark_id: targetBark._id, user_id: dummyDbData.users[0]._id },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          await fetch({ method: 'PUT', headers: { KEY } });

          expect(
            await (await getDb()).collection('barks').findOne({ _id: targetBark._id })
          ).toStrictEqual(
            expect.objectContaining({
              bark_id: targetBark._id,
              likes: expect.arrayContaining([dummyDbData.users[0]._id])
            })
          );
        }
      });
    });

    it('system metadata (bark and user) is updated', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[99];

      expect(dummyDbData.users[0].liked).not.toContain(targetBark._id);

      await testApiHandler({
        params: { bark_id: targetBark._id, user_id: dummyDbData.users[0]._id },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          await fetch({ method: 'PUT', headers: { KEY } });

          expect(
            await (await getDb()).collection('barks').findOne({ _id: targetBark._id })
          ).toStrictEqual(
            expect.objectContaining({
              bark_id: targetBark._id,
              likes: expect.not.arrayContaining([targetBark.likes[0]])
            })
          );

          expect(
            await (await getDb())
              .collection('users')
              .findOne({ _id: dummyDbData.users[0]._id })
          ).toStrictEqual(
            expect.objectContaining({
              user_id: dummyDbData.users[0]._id,
              liked: expect.not.arrayContaining([targetBark._id])
            })
          );
        }
      });
    });

    it('does not error if the user has already liked the bark', async () => {
      expect.hasAssertions();

      const targetBark = dummyDbData.barks[10];

      await testApiHandler({
        params: { bark_id: targetBark._id, user_id: targetBark.likes[0] },
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          expect(
            await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
          ).toBe(200);
        }
      });
    });
  });

  describe('/search [GET]', () => {
    it('returns expected barks with respect to offset', async () => {
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
