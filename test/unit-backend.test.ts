import { WithId /* ObjectId */ } from 'mongodb';
import * as Backend from 'universe/backend';
import { getEnv } from 'universe/backend/env';
import { asMockedFunction, itemFactory, mockEnvFactory } from 'testverse/setup';
//import sha256 from 'crypto-js/sha256';

import {
  setupJest /* unhydratedDummyDbData, EXPAND_RESULTS_BY_MULT */
} from 'testverse/db';

import { RequestLogEntry, LimitedLogEntry } from 'types/global';

import type { NextApiRequest, NextApiResponse } from 'next';

const { /* getHydratedData, */ getDb } = setupJest();
const withMockedEnv = mockEnvFactory(
  {
    REQUESTS_PER_CONTRIVED_ERROR: '0',
    DISABLED_API_VERSIONS: ''
  },
  { replace: false }
);

it('functions when there are no barks in the system', async () => {
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

it('returns same barks as GET /barks if no query params given', async () => {
  expect.hasAssertions();
});

it('ensure numerical matches against likes (totalLikes), rebarks (totalRebarks), and barkbacks (totalBarkbacks) are properly proxied', async () => {
  expect.hasAssertions();
});

it('returns expected barks with respect to all possible query params simultaneously', async () => {
  expect.hasAssertions();
});

it('does not error if the user has already liked the bark', async () => {
  expect.hasAssertions();

  await testApiHandler({
    params: {
      bark_id: new ObjectId().toString(),
      user_id: new ObjectId().toString()
    },
    handler: api.barksIdLikesId,
    test: async ({ fetch }) => {
      expect(await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)).toBe(
        200
      );
    }
  });
});

it('does not error if the user has not liked the bark', async () => {
  expect.hasAssertions();

  await testApiHandler({
    params: {
      bark_id: new ObjectId().toString(),
      user_id: new ObjectId().toString()
    },
    handler: api.barksIdLikesId,
    test: async ({ fetch }) => {
      expect(
        await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
      ).toBe(200);
    }
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
  });

  it('system metadata is updated', async () => {
    expect.hasAssertions();
  });

  // TODO: test includeIndirect

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

it('system metadata (bark and user) is updated', async () => {
  expect.hasAssertions();

  const targetBark = dummyDbData.barks[99];

  expect(dummyDbData.users[0].liked).not.toContain(new ObjectId().toString());

  await testApiHandler({
    params: { bark_id: new ObjectId().toString(), user_id: dummyDbData.users[0]._id },
    handler: api.barksIdLikesId,
    test: async ({ fetch }) => {
      await fetch({ method: 'PUT', headers: { KEY } });

      expect(
        await (await getDb())
          .collection('barks')
          .findOne({ _id: new ObjectId().toString() })
      ).toStrictEqual(
        expect.objectContaining({
          bark_id: new ObjectId().toString(),
          likes: expect.not.arrayContaining([new ObjectId().toString()])
        })
      );

      expect(
        await (await getDb())
          .collection('users')
          .findOne({ _id: dummyDbData.users[0]._id })
      ).toStrictEqual(
        expect.objectContaining({
          user_id: dummyDbData.users[0]._id,
          liked: expect.not.arrayContaining([new ObjectId().toString()])
        })
      );
    }
  });
});

it('system metadata (bark and user) is updated', async () => {
  expect.hasAssertions();

  await testApiHandler({
    params: {
      bark_id: new ObjectId().toString(),
      user_id: new ObjectId().toString()
    },
    handler: api.barksIdLikesId,
    test: async ({ fetch }) => {
      await fetch({ method: 'DELETE', headers: { KEY } });

      expect(
        await (await getDb())
          .collection('barks')
          .findOne({ _id: new ObjectId().toString() })
      ).toStrictEqual(
        expect.objectContaining({
          bark_id: new ObjectId().toString(),
          likes: expect.not.arrayContaining([new ObjectId().toString()])
        })
      );

      expect(
        await (await getDb())
          .collection('users')
          .findOne({ _id: new ObjectId().toString() })
      ).toStrictEqual(
        expect.objectContaining({
          user_id: new ObjectId().toString(),
          liked: expect.not.arrayContaining([new ObjectId().toString()])
        })
      );
    }
  });
});

//const key = Backend.DUMMY_KEY;

// it('functions when no barks in the system', async () => {
//   expect.hasAssertions();

//   await testApiHandler({
//     handler: api.barks,
//     test: async ({ fetch }) => {
//       const json = await fetch({ headers: { KEY } }).then((r) => r.json());

//       expect(json.success).toBe(true);
//       expect(json.barks).toStrictEqual([]);
//     }
//   });
// });

// TODO: TEST: errors if one or more IDs not found and/or duplicated
// TODO: TEST: errors if one or more IDs not found and/or duplicated
// TODO: in LIFO order

// it('system metadata is updated', async () => {
//   expect.hasAssertions();

//   await testApiHandler({
//     params: { bark_ids: [dummyDbData.barks[0]._id] },
//     handler: api.barksIds,
//     test: async ({ fetch }) => {
//       await fetch({ method: 'DELETE', headers: { KEY } });

//       expect(await (await getDb()).collection('info').findOne({})).toStrictEqual(
//         expect.objectContaining({ totalBarks: dummyDbData.info.totalBarks - 1 })
//       );
//     }
//   });
// });

it('logs requests properly', async () => {
  expect.hasAssertions();

  const factory = itemFactory([502, 404, 403, 200]);

  await testApiHandler({
    requestPatcher: (req) => {
      req.headers = {
        ...req.headers,
        'x-forwarded-for': '10.0.0.115',
        key: DUMMY_KEY
      };

      req.url = '/api/v1/handlerX';
    },
    handler: wrapMiddlewareHandler((req, res) =>
      wrapHandler(async ({ res }) => res.status(factory()).send({}), {
        req,
        res,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      })
    ),
    test: async ({ fetch }) => {
      await fetch({ method: 'GET' });
      await fetch({ method: 'POST' });
      await fetch({ method: 'PUT' });
      await fetch({ method: 'DELETE' });

      // ? Logs are added asynchronously, so let's wait a bit...
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

      const logs = await (
        await getDb()
      )
        .collection<RequestLogEntry>('request-log')
        .find()
        .sort({
          time: 1
        })
        .limit(4)
        .project({
          _id: false,
          time: false
        })
        .toArray();

      expect(logs).toIncludeAllMembers([
        {
          ip: '10.0.0.115',
          key: DUMMY_KEY,
          method: 'GET',
          route: 'v1/handlerX',
          resStatusCode: 502
        },
        {
          ip: '10.0.0.115',
          key: DUMMY_KEY,
          method: 'POST',
          route: 'v1/handlerX',
          resStatusCode: 404
        },
        {
          ip: '10.0.0.115',
          key: DUMMY_KEY,
          method: 'PUT',
          route: 'v1/handlerX',
          resStatusCode: 403
        },
        {
          ip: '10.0.0.115',
          key: DUMMY_KEY,
          method: 'DELETE',
          route: 'v1/handlerX',
          resStatusCode: 200
        }
      ]);
    }
  });
});

it('requests are limited in accordance with the database except when ignoring rate limits', async () => {
  expect.hasAssertions();

  const ip = '7.7.7.7';
  const key = DUMMY_KEY;
  const limitedLog = (await getDb()).collection<LimitedLogEntry>('limited-log-mview');

  await testApiHandler({
    requestPatcher: (req) => (req.headers['x-forwarded-for'] = ip),
    handler: wrapMiddlewareHandler((req, res) =>
      wrapHandler(noop, {
        req,
        res,
        methods: ['GET']
      })
    ),
    test: async ({ fetch }) => {
      let entry = null;

      expect((await fetch({ headers: { key } })).status).toBe(200);

      const _now = Date.now;
      const now = Date.now();
      Date.now = () => now;

      entry = await limitedLog.insertOne({ ip, until: now + 1000 * 60 * 15 });
      const res = await fetch({ headers: { key } });
      expect(res.status).toBe(429);

      expect(await res.json()).toContainEntry<{ retryAfter: number }>([
        'retryAfter',
        1000 * 60 * 15
      ]);

      await limitedLog.deleteOne({ _id: entry.insertedId });
      expect((await fetch({ headers: { key } })).status).toBe(200);

      entry = await limitedLog.insertOne({ key, until: Date.now() + 1000 * 60 * 60 });
      expect((await fetch({ headers: { key } })).status).toBe(429);

      process.env.IGNORE_RATE_LIMITS = 'true';
      expect((await fetch({ headers: { key } })).status).toBe(200);

      process.env.IGNORE_RATE_LIMITS = 'false';
      expect((await fetch({ headers: { key } })).status).toBe(429);

      await limitedLog.deleteOne({ _id: entry.insertedId });
      expect((await fetch({ headers: { key } })).status).toBe(200);

      Date.now = _now;
    }
  });
});

// it('creates and returns new barks', async () => {
//   expect.hasAssertions();

//   const factory = itemFactory([
//     {
//       owner: dummyDbData.users[0]._id,
//       content: '1',
//       private: false,
//       barkbackTo: null,
//       rebarkOf: null
//     },
//     {
//       owner: new ObjectId(),
//       content: '2',
//       private: false,
//       barkbackTo: null,
//       rebarkOf: null
//     },
//     {
//       owner: dummyDbData.users[0]._id,
//       content: '3',
//       private: false,
//       barkbackTo: dummyDbData.barks[0]._id,
//       rebarkOf: null
//     },
//     {
//       owner: dummyDbData.users[0]._id,
//       content: '4',
//       private: false,
//       barkbackTo: null,
//       rebarkOf: dummyDbData.barks[0]._id
//     },
//     {
//       owner: dummyDbData.users[0]._id,
//       content: '5',
//       private: true,
//       barkbackTo: null,
//       rebarkOf: null
//     }
//   ]);

//   await testApiHandler({
//     handler: api.barks,
//     test: async ({ fetch }) => {
//       const responses = await Promise.all(
//         Array.from({ length: factory.count }).map((_) =>
//           fetch({
//             method: 'POST',
//             headers: { KEY, 'content-type': 'application/json' },
//             body: JSON.stringify(factory())
//           }).then(async (r) => [r.status, await r.json()])
//         )
//       );

//       expect(responses).toStrictEqual(
//         Array.from({ length: factory.count }).map(() => [
//           200,
//           expect.objectContaining({ bark: expect.anything() })
//         ])
//       );

//       expect(mockedCreateBark).toBeCalledTimes(factory.count);
//     }
//   });
// });

// it('system metadata is updated', async () => {
//   expect.hasAssertions();

//   await testApiHandler({
//     handler: api.barks,
//     test: async ({ fetch }) => {
//       await fetch({
//         method: 'POST',
//         headers: { KEY, 'content-type': 'application/json' },
//         body: JSON.stringify({
//           owner: dummyDbData.users[0]._id,
//           content: '1',
//           private: false,
//           barkbackTo: null,
//           rebarkOf: null
//         })
//       });

//       expect(await (await getDb()).collection('info').findOne({})).toStrictEqual(
//         expect.objectContaining({ totalBarks: dummyDbData.info.totalBarks + 1 })
//       );
//     }
//   });
// });

// it('errors if request body is invalid', async () => {
//   expect.hasAssertions();

//   const yieldCount = 11;
//   const getInvalidData = (function* () {
//     yield {};
//     yield { data: 1 };
//     yield { content: '', createdAt: Date.now() };
//     yield {
//       owner: '',
//       content: '',
//       private: false
//     };
//     yield {
//       owner: dummyDbData.users[0]._id,
//       content: 'xyz',
//       private: false
//     };
//     yield {
//       owner: dummyDbData.users[0]._id,
//       content: '',
//       private: false,
//       barkbackTo: null,
//       rebarkOf: null
//     };
//     yield {
//       owner: new ObjectId(),
//       content: 'xyz',
//       private: false,
//       barkbackTo: null,
//       rebarkOf: null
//     };
//     yield {
//       owner: dummyDbData.users[0]._id,
//       content: 'xyz',
//       private: false,
//       barkbackTo: new ObjectId(),
//       rebarkOf: null
//     };
//     yield {
//       owner: dummyDbData.users[0]._id,
//       content: 'xyz',
//       private: false,
//       barkbackTo: null,
//       rebarkOf: new ObjectId()
//     };
//     yield {
//       owner: dummyDbData.users[0]._id,
//       content: 'xyz',
//       private: false,
//       barkbackTo: false,
//       rebarkOf: null
//     };
//     yield {
//       owner: dummyDbData.users[0]._id,
//       content: 'xyz',
//       private: false,
//       barkbackTo: dummyDbData.barks[0]._id,
//       rebarkOf: dummyDbData.barks[1]._id
//     } as NewBark;
//   })();

//   await testApiHandler({
//     handler: api.barks,
//     test: async ({ fetch }) => {
//       const responses = await Promise.all(
//         Array.from({ length: yieldCount }).map((_) =>
//           fetch({
//             method: 'POST',
//             headers: { KEY, 'content-type': 'application/json' },
//             body: JSON.stringify(getInvalidData.next().value)
//           }).then((r) => r.status)
//         )
//       );

//       expect(responses).toStrictEqual(
//         Array.from({ length: yieldCount }).map((_) => 400)
//       );
//     }
//   });
// });

describe('/:bark_id/likes/:user_id [DELETE]', () => {
  it('the user "unlikes" the bark', async () => {
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
          await (await getDb()).collection('users').findOne({ _id: targetBark.likes[0] })
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

describe('universe/backend', () => {
  describe('::addToRequestLog', () => {
    it('adds request to log as expected', async () => {
      expect.hasAssertions();
      const req1 = {
        headers: { 'x-forwarded-for': '9.9.9.9' },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest;

      const req2 = {
        headers: {
          'x-forwarded-for': '8.8.8.8',
          key: Backend.NULL_KEY
        },
        method: 'GET',
        url: '/api/route/path2'
      } as unknown as NextApiRequest;

      const res1 = { statusCode: 1111 } as NextApiResponse;
      const res2 = { statusCode: 2222 } as NextApiResponse;

      const now = Date.now();
      const _now = Date.now;
      Date.now = () => now;

      await Backend.addToRequestLog({ req: req1, res: res1 });
      await Backend.addToRequestLog({ req: req2, res: res2 });

      Date.now = _now;

      const reqlog = (await getDb()).collection<WithId<RequestLogEntry>>('request-log');

      const { _id: _, ...log1 } = (await reqlog.findOne({ resStatusCode: 1111 })) || {};
      const { _id: __, ...log2 } = (await reqlog.findOne({ resStatusCode: 2222 })) || {};

      expect(log1).toStrictEqual({
        ip: '9.9.9.9',
        key: null,
        route: 'route/path1',
        method: 'POST',
        time: now,
        resStatusCode: 1111
      });

      expect(log2).toStrictEqual({
        ip: '8.8.8.8',
        key: Backend.NULL_KEY,
        route: 'route/path2',
        method: 'GET',
        time: now,
        resStatusCode: 2222
      });
    });
  });

  describe('::isRateLimited', () => {
    it('returns true if ip or key are rate limited', async () => {
      expect.hasAssertions();
      const _now = Date.now;
      const now = Date.now();
      Date.now = () => now;

      const req1 = await Backend.isRateLimited({
        headers: { 'x-forwarded-for': '1.2.3.4' },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest);

      const req2 = await Backend.isRateLimited({
        headers: {
          'x-forwarded-for': '8.8.8.8',
          key: Backend.NULL_KEY
        },
        method: 'GET',
        url: '/api/route/path2'
      } as unknown as NextApiRequest);

      const req3 = await Backend.isRateLimited({
        headers: {
          'x-forwarded-for': '1.2.3.4',
          key: 'fake-key'
        },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest);

      const req4 = await Backend.isRateLimited({
        headers: {
          'x-forwarded-for': '5.6.7.8'
        },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest);

      const req5 = await Backend.isRateLimited({
        headers: {
          'x-forwarded-for': '1.2.3.4',
          key: Backend.NULL_KEY
        },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest);

      expect(req1.limited).toBeTrue();
      expect(req2.limited).toBeTrue();
      expect(req3.limited).toBeTrue();
      expect(req4.limited).toBeTrue();
      expect(req5.limited).toBeTrue();

      expect(req1.retryAfter).toBeWithin(1000 * 60 * 15 - 1000, 1000 * 60 * 15 + 1000);
      expect(req2.retryAfter).toBeWithin(1000 * 60 * 60 - 1000, 1000 * 60 * 60 + 1000);
      expect(req3.retryAfter).toBeWithin(1000 * 60 * 15 - 1000, 1000 * 60 * 15 + 1000);
      expect(req4.retryAfter).toBeWithin(1000 * 60 * 15 - 1000, 1000 * 60 * 15 + 1000);
      // ? Should return greater of the two ban times (key time > ip time)
      expect(req5.retryAfter).toBeWithin(1000 * 60 * 60 - 1000, 1000 * 60 * 60 + 1000);

      Date.now = _now;
    });

    it('returns false iff both ip and key (if provided) are not rate limited', async () => {
      expect.hasAssertions();
      const req1 = {
        headers: { 'x-forwarded-for': '1.2.3.5' },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest;

      const req2 = {
        headers: {
          'x-forwarded-for': '8.8.8.8',
          key: 'fake-key'
        },
        method: 'GET',
        url: '/api/route/path2'
      } as unknown as NextApiRequest;

      expect(await Backend.isRateLimited(req1)).toStrictEqual({
        limited: false,
        retryAfter: 0
      });
      expect(await Backend.isRateLimited(req2)).toStrictEqual({
        limited: false,
        retryAfter: 0
      });
    });

    it('returns false if "until" time has passed', async () => {
      expect.hasAssertions();
      const req = {
        headers: { 'x-forwarded-for': '1.2.3.4' },
        method: 'POST',
        url: '/api/route/path1'
      } as unknown as NextApiRequest;

      expect(await Backend.isRateLimited(req)).toContainEntry(['limited', true]);

      await (await getDb())
        .collection<LimitedLogEntry>('limited-log-mview')
        .updateOne({ ip: '1.2.3.4' }, { $set: { until: Date.now() - 10 ** 5 } });

      expect(await Backend.isRateLimited(req)).toStrictEqual({
        limited: false,
        retryAfter: 0
      });
    });
  });

  describe('::isDueForContrivedError', () => {
    it('returns true after REQUESTS_PER_CONTRIVED_ERROR invocations', async () => {
      expect.hasAssertions();
      const rate = getEnv().REQUESTS_PER_CONTRIVED_ERROR;

      expect(
        Array.from({ length: rate * 2 }).map(() => Backend.isDueForContrivedError())
      ).toStrictEqual([
        ...Array.from({ length: rate - 1 }).map(() => false),
        true,
        ...Array.from({ length: rate - 1 }).map(() => false),
        true
      ]);
    });
  });
});
