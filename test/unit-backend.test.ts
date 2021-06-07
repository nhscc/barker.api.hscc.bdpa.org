import sha256 from 'crypto-js/sha256';
import { WithId, ObjectId } from 'mongodb';
import * as Backend from 'universe/backend';
import { getEnv } from 'universe/backend/env';
import { setupTestDb, dummyDbData } from 'testverse/db';
import { itemFactory, mockEnvFactory } from 'testverse/setup';

import {
  InternalRequestLogEntry,
  InternalLimitedLogEntry,
  InternalInfo,
  InternalUser,
  PublicUser,
  PublicBark,
  InternalBark
} from 'types/global';
import type { NextApiRequest, NextApiResponse } from 'next';

const { getDb } = setupTestDb();

const withMockedEnv = mockEnvFactory({}, { replace: false });

const toPublicUser = (internal: WithId<InternalUser>): PublicUser => ({
  user_id: internal._id.toString(),
  name: internal.name,
  email: internal.email,
  phone: internal.phone,
  username: internal.username,
  packmates: internal.packmates.length,
  following: internal.following.length,
  bookmarked: internal.bookmarked.length,
  liked: internal.liked.length,
  deleted: internal.deleted
});

const toPublicBark = (internal: WithId<InternalBark>): PublicBark => ({
  bark_id: internal._id.toString(),
  likes: internal.totalLikes,
  rebarks: internal.totalRebarks,
  barkbacks: internal.totalBarkbacks,
  owner: internal.owner,
  content: internal.content,
  createdAt: internal.createdAt,
  deleted: internal.deleted,
  private: internal.private,
  barkbackTo: internal.barkbackTo,
  rebarkOf: internal.rebarkOf
});

describe('::getSystemInfo', () => {
  it('returns summary system metadata', async () => {
    expect.hasAssertions();
    expect(await Backend.getSystemInfo()).toStrictEqual<InternalInfo>({
      totalBarks: dummyDbData.info.totalBarks,
      totalUsers: dummyDbData.info.totalUsers
    });
  });

  it('functions when the database is empty', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection('info')
      .updateOne({}, { $set: { totalBarks: 0, totalUsers: 0 } });

    expect(await Backend.getSystemInfo()).toStrictEqual<InternalInfo>({
      totalBarks: 0,
      totalUsers: 0
    });
  });
});

describe('::getBarks', () => {
  it('returns one or more barks by ID', async () => {
    expect.hasAssertions();

    const testBarks = [[], [dummyDbData.barks[0]], dummyDbData.barks.slice(10, 20)];

    await Promise.all(
      testBarks.map((barks) =>
        expect(
          Backend.getBarks({ bark_ids: barks.map((b) => b._id) })
        ).resolves.toIncludeSameMembers(barks.map(toPublicBark))
      )
    );
  });

  it('rejects if bark_ids not found', async () => {
    expect.hasAssertions();

    await expect(Backend.getBarks({ bark_ids: [new ObjectId()] })).rejects.toMatchObject({
      message: expect.stringContaining('some or all')
    });
  });

  it('functions when no barks in the database', async () => {
    expect.hasAssertions();

    const db = await getDb();
    await db.collection('barks').deleteMany({});
    await db.collection('users').deleteMany({});

    await expect(
      Backend.getBarks({ bark_ids: [dummyDbData.barks[0]._id] })
    ).rejects.toMatchObject({
      message: expect.stringContaining('some or all')
    });
  });

  it('rejects if too many bark_ids requested', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        await expect(
          Backend.getBarks({ bark_ids: [new ObjectId(), new ObjectId()] })
        ).rejects.toMatchObject({
          message: expect.stringContaining('too many')
        });
      },
      { RESULTS_PER_PAGE: '1' }
    );
  });
});

describe('::deleteBarks', () => {
  it('deletes one or more barks and updates system metadata', async () => {
    expect.hasAssertions();

    const testIds = [[], [dummyDbData.barks[0]], dummyDbData.barks.slice(10, 20)].map(
      (barks) => barks.map((bark) => bark._id)
    );

    await Promise.all(testIds.map((bark_ids) => Backend.deleteBarks({ bark_ids })));

    expect(
      await (
        await getDb()
      )
        .collection('barks')
        .find({ _id: { $in: testIds.flat() } })
        .count()
    ).toBe(0);
  });

  it('rejects if bark_ids not found', async () => {
    expect.hasAssertions();
  });

  it('rejects if too many bark_id requested', async () => {
    expect.hasAssertions();
  });
});

describe('::getBarkLikesUserIds', () => {
  it('returns user_ids that liked a bark in LIFO order', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions with barks that have never been liked', async () => {
    expect.hasAssertions();
  });

  it('rejects if bark_id not found', async () => {
    expect.hasAssertions();
  });
});

describe('::getUserLikedBarkIds', () => {
  it('returns bark_id of barks that a user liked in LIFO order', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when user has no liked barks', async () => {
    expect.hasAssertions();
  });

  it('rejects if ID not found', async () => {
    expect.hasAssertions();
  });
});

describe('::isBarkLiked', () => {
  it('returns true iff the bark is liked by the specified user', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::unlikeBark', () => {
  it('unlikes a bark', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user never liked the bark', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
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

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::likeBark', () => {
  it('likes a bark', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user already liked the bark', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::createBark', () => {
  it('creates and returns a new bark', async () => {
    expect.hasAssertions();

    const factory = itemFactory([
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
    ]);

    await testApiHandler({
      handler: api.barks,
      test: async ({ fetch }) => {
        const responses = await Promise.all(
          Array.from({ length: factory.count }).map((_) =>
            fetch({
              method: 'POST',
              headers: { KEY, 'content-type': 'application/json' },
              body: JSON.stringify(factory())
            }).then(async (r) => [r.status, await r.json()])
          )
        );

        expect(responses).toStrictEqual(
          Array.from({ length: factory.count }).map(() => [
            200,
            expect.objectContaining({ bark: expect.anything() })
          ])
        );

        expect(mockedCreateBark).toBeCalledTimes(factory.count);
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

    // TODO: test content too long/too short

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

  it('system metadata is updated upon bark creation', async () => {
    expect.hasAssertions();
  });
});

describe('::getAllUsers', () => {
  it('returns all users in LIFO order', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when no users in the database', async () => {
    expect.hasAssertions();
  });
});

describe('::getUser', () => {
  it('returns user by ID', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('rejects if ID not found', async () => {
    expect.hasAssertions();
  });
});

describe('::deleteUser', () => {
  it('system metadata is updated upon user deletion', async () => {
    expect.hasAssertions();
  });

  it('rejects if ID not found', async () => {
    expect.hasAssertions();
  });
});

describe('::getFollowingUserIds', () => {
  it('returns users that a user is following in LIFO order', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when user has no followers', async () => {
    expect.hasAssertions();
  });

  it('includeIndirect returns direct and indirect followers', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::isUserFollowing', () => {
  it('returns true iff the specified user is following the other', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::followUser', () => {
  it('assigns the specified user as a follower of another', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user is already a follower', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::unfollowUser', () => {
  it('removes the specified user as a follower of another', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user was never a follower', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::getPackmateUserIds', () => {
  it('returns packmates in LIFO order', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when user has no packmates', async () => {
    expect.hasAssertions();
  });

  it('rejects if id not found', async () => {
    expect.hasAssertions();
  });
});

describe('::isUserPackmate', () => {
  it('returns true iff a user is in the pack', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::addPackmate', () => {
  it('adds a user to the pack', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user is already in the pack', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::removePackmate', () => {
  it('removes a user from the pack', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user was never in the pack', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::getBookmarkedBarkIds', () => {
  it('returns barks that a user bookmarked in LIFO order', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when user has no bookmarked barks', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::isBarkBookmarked', () => {
  it('returns true iff a bark is bookmarked', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::bookmarkBark', () => {
  it('bookmarks a bark', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user has already bookmarked the bark', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::unbookmarkBark', () => {
  it('unbookmarks a bark', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user never bookmarked the bark', async () => {
    expect.hasAssertions();
  });

  it('bark and user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();
  });
});

describe('::createUser', () => {
  it('creates and returns a new user', async () => {
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

    // TODO: test bad name, email, phone, username
    // TODO: test null phone

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

  it('system metadata is updated upon user creation', async () => {
    expect.hasAssertions();
  });
});

describe('::updateUser', () => {
  it('user data is updated in the database', async () => {
    expect.hasAssertions();
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();
  });

  it('rejects if id not found', async () => {
    expect.hasAssertions();
  });
});

describe('::searchBarks', () => {
  it('returns all barks in LIFO order if no query params given', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when no barks in the database', async () => {
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

describe('::getApiKeys', () => {
  it('returns all API keys (SHA-256 hashed)', async () => {
    expect.hasAssertions();
  });
});

describe('::isKeyAuthentic', () => {
  it('returns true iff an API key is found in the system', async () => {
    expect.hasAssertions();
  });
});

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

    const reqlog = (await getDb()).collection<WithId<InternalRequestLogEntry>>(
      'request-log'
    );

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
      .collection<InternalLimitedLogEntry>('limited-log-mview')
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
