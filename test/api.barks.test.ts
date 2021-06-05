/* eslint-disable no-await-in-loop */
import { wrapHandler } from 'universe/backend/middleware';
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

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const mockedGetBarks = asMockedFunction(getBarks);
const mockedDeleteBarks = asMockedFunction(deleteBarks);
const mockedGetBarkLikesUserIds = asMockedFunction(getBarkLikesUserIds);
const mockedIsBarkLiked = asMockedFunction(isBarkLiked);
const mockedSearchBarks = asMockedFunction(searchBarks);
const mockedCreateBark = asMockedFunction(createBark);

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
    it('returns barks', async () => {
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

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.barks,
        test: async ({ fetch }) => {
          const json = await fetch().then((r) => r.json());

          expect(json.success).toBe(true);
          expect(json.barks).toBeArray();
          expect(mockedSearchBarks).toBeCalledWith(
            expect.objectContaining({ after: expect.anything() })
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
        handler: api.barks,
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
    it('accepts a new bark schema; returns a bark', async () => {
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
    it('accepts one or more bark_ids; returns barks', async () => {
      expect.hasAssertions();

      const items = [
        [new ObjectId().toString()],
        [new ObjectId().toString(), new ObjectId().toString()]
      ];

      items.push([items[0][0], items[0][0]]);

      const params = { bark_ids: [] as string[] };

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

    it('errors if getBarks returns a different number of barks than requested', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { bark_ids: [new ObjectId().toString()] },
        handler: api.barksIds,
        test: async ({ fetch }) => {
          mockedGetBarks.mockReturnValue(
            Promise.resolve([]) as unknown as ReturnType<typeof mockedGetBarks>
          );

          expect(await fetch().then((r) => r.status)).toBe(404);
        }
      });
    });

    it('errors if invalid bark_ids given', async () => {
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
    it('accepts multiple bark_ids, ignoring not found and duplicates', async () => {
      expect.hasAssertions();

      const items = [
        [new ObjectId().toString()],
        [new ObjectId().toString(), new ObjectId().toString()]
      ];

      items.push([items[0][0], items[0][0]]);

      const params = { bark_ids: [] as string[] };

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

    it('errors if invalid bark_ids given', async () => {
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
    it('accepts bark_id and returns user_ids; errors if invalid bark_id given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ bark_id: 'invalid-id' }, 400],
        [{ bark_id: new ObjectId().toString() }, 200]
      ]);

      const params = { bark_id: '' };

      await testApiHandler({
        params,
        handler: api.barksIdLikes,
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
        params: { bark_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
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
        params: { bark_id: new ObjectId().toString() },
        handler: api.barksIdLikes,
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

  describe('/:bark_id/likes/:user_id [GET]', () => {
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
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toBe(expectedStatus);
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
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toBe(404);
        }
      });
    });
  });

  describe('/:bark_id/likes/:user_id [DELETE]', () => {
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
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).toBe(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:bark_id/likes/:user_id [PUT]', () => {
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
        handler: api.barksIdLikesId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).toBe(expectedStatus);
          }
        }
      });
    });
  });

  describe('/search [GET]', () => {
    it('accepts various query params with pagination; returns barks', async () => {
      expect.hasAssertions();

      const encoded = encodeURIComponent(JSON.stringify({}));
      const factory = itemFactory([
        `/?after=${new ObjectId()}`,
        `/?match=${encoded}`,
        `/?regexMatch=${encoded}`,
        `/?match=${encoded}&regexMatch=${encoded}`,
        `/?match=${encoded}&regexMatch=${encoded}&after=${new ObjectId()}`,
        `/?dne=123`,
        `/`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        handler: api.barksSearch,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toStrictEqual(
            Array.from({ length: factory.count }).map(() => 200)
          );
        }
      });
    });

    it('handles invalid query params', async () => {
      expect.hasAssertions();

      const encoded = encodeURIComponent(JSON.stringify({}));
      const factory = itemFactory([
        `/?after=xyz`,
        `/?match={abc:123}`,
        `/?regexMatch={abc:123}`,
        `/?match={abc:123}&regexMatch=${encoded}`,
        `/?match=${encoded}&regexMatch={abc:123}&after=${new ObjectId()}`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        handler: api.barksSearch,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch().then((r) => r.status);
            })
          );

          expect(responses).toStrictEqual(
            Array.from({ length: factory.count }).map(() => 400)
          );
        }
      });
    });
  });
});
