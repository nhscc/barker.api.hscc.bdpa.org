/* eslint-disable no-await-in-loop */
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
  InternalBark,
  UserId,
  BarkId,
  NewBark,
  NewUser,
  PatchUser,
  InternalApiKey
} from 'types/global';
import type { NextApiRequest, NextApiResponse } from 'next';
import { itemToObjectId, itemToStringId } from 'universe/backend/db';

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
  it('deletes one or more barks', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const testIds = [[], [dummyDbData.barks[0]], dummyDbData.barks.slice(10, 20)].map(
      (barks) => barks.map((bark) => bark._id)
    );

    await db
      .collection('barks')
      .updateMany({ _id: { $in: testIds.flat() } }, { $set: { deleted: false } });

    await Promise.all(testIds.map((bark_ids) => Backend.deleteBarks({ bark_ids })));

    expect(
      await db
        .collection('barks')
        .find({ _id: { $in: testIds.flat() }, deleted: false })
        .count()
    ).toBe(0);
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const testIds = itemToObjectId(
      dummyDbData.barks.filter((bark) => !bark.deleted).slice(0, 10)
    );

    await Backend.deleteBarks({ bark_ids: testIds });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalBarks)
    ).toBe(90);
  });

  it('rejects if bark_ids not found', async () => {
    expect.hasAssertions();

    await expect(
      Backend.deleteBarks({ bark_ids: [new ObjectId()] })
    ).rejects.toMatchObject({
      message: expect.stringContaining('some or all')
    });
  });

  it('rejects if too many bark_id requested', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        await expect(
          Backend.deleteBarks({ bark_ids: [new ObjectId(), new ObjectId()] })
        ).rejects.toMatchObject({
          message: expect.stringContaining('too many')
        });
      },
      { RESULTS_PER_PAGE: '1' }
    );
  });
});

describe('::getBarkLikesUserIds', () => {
  it('returns user_ids that liked a bark', async () => {
    expect.hasAssertions();

    const barks = dummyDbData.barks.map<[ObjectId, UserId[]]>((b) => [b._id, b.likes]);

    for (const [bark_id, expectedIds] of barks) {
      expect(await Backend.getBarkLikesUserIds({ bark_id, after: null })).toStrictEqual(
        itemToStringId(expectedIds)
      );
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getBarkLikesUserIds({
            bark_id: dummyDbData.barks[10]._id,
            after: dummyDbData.barks[10].likes[3]
          })
        ).toStrictEqual(itemToStringId(dummyDbData.barks[10].likes.slice(4, 7)));
      },
      { RESULTS_PER_PAGE: '3' }
    );
  });

  it('rejects if bark_id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(
      Backend.getBarkLikesUserIds({ bark_id: id, after: null })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::getUserLikedBarkIds', () => {
  it('returns bark_id of barks that a user liked', async () => {
    expect.hasAssertions();

    const users = dummyDbData.users.map<[ObjectId, BarkId[]]>((u) => [u._id, u.liked]);

    for (const [user_id, expectedIds] of users) {
      expect(await Backend.getUserLikedBarkIds({ user_id, after: null })).toStrictEqual(
        itemToStringId(expectedIds)
      );
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getUserLikedBarkIds({
            user_id: dummyDbData.users[0]._id,
            after: dummyDbData.users[0].liked[3]
          })
        ).toStrictEqual(itemToStringId(dummyDbData.users[0].liked.slice(4, 7)));
      },
      { RESULTS_PER_PAGE: '3' }
    );
  });

  it('functions when user has no liked barks', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne({ _id: dummyDbData.users[0]._id }, { $set: { liked: [] } });

    expect(
      await Backend.getUserLikedBarkIds({
        user_id: dummyDbData.users[0]._id,
        after: null
      })
    ).toStrictEqual([]);
  });

  it('rejects if user_id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(
      Backend.getUserLikedBarkIds({ user_id: id, after: null })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::isBarkLiked', () => {
  it('returns true iff the bark is liked by the specified user', async () => {
    expect.hasAssertions();

    const items: [UserId, BarkId, boolean][] = [
      [dummyDbData.users[0]._id, dummyDbData.barks[0]._id, false],
      [dummyDbData.users[0]._id, dummyDbData.barks[1]._id, true]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, expectedTruth]) =>
        expect(Backend.isBarkLiked({ user_id, bark_id })).resolves.toBe(expectedTruth)
      )
    );
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, ndx]) =>
        expect(Backend.isBarkLiked({ user_id, bark_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : bark_id))
        })
      )
    );
  });
});

describe('::unlikeBark', () => {
  it('unlikes a bark and updates bark and user metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const barks = await db.collection<InternalBark>('barks');
    const users = await db.collection<InternalUser>('users');
    const testBarks = itemToObjectId(dummyDbData.users[0].liked);

    expect(
      await users.findOne({ _id: dummyDbData.users[0]._id }).then((r) => r?.liked)
    ).not.toStrictEqual([]);

    expect(
      await barks
        .find({ _id: { $in: testBarks }, likes: dummyDbData.users[0]._id })
        .count()
    ).not.toStrictEqual(0);

    await Promise.all(
      testBarks.map((id) =>
        Backend.unlikeBark({ user_id: dummyDbData.users[0]._id, bark_id: id })
      )
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[0]._id }).then((r) => r?.liked)
    ).toStrictEqual([]);

    expect(
      await barks
        .find({ _id: { $in: testBarks }, likes: dummyDbData.users[0]._id })
        .count()
    ).toStrictEqual(0);
  });

  it('does not error if the user never liked the bark', async () => {
    expect.hasAssertions();

    await expect(
      Backend.unlikeBark({
        user_id: dummyDbData.users[0]._id,
        bark_id: dummyDbData.barks[0]._id
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, ndx]) =>
        expect(Backend.unlikeBark({ user_id, bark_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : bark_id))
        })
      )
    );
  });
});

describe('::likeBark', () => {
  it('likes a bark and updates bark and user metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const barks = await db.collection<InternalBark>('barks');
    const users = await db.collection<InternalUser>('users');
    const originallyLikedBarks = itemToStringId(dummyDbData.users[0].liked);
    const newlyLikedBarks = dummyDbData.barks
      .filter((bark) => !originallyLikedBarks.includes(itemToStringId(bark)))
      .map<ObjectId>(itemToObjectId);

    expect(
      await users.findOne({ _id: dummyDbData.users[0]._id }).then((r) => r?.liked.length)
    ).toStrictEqual(originallyLikedBarks.length);

    expect(
      await barks
        .find({ _id: { $in: newlyLikedBarks }, likes: dummyDbData.users[0]._id })
        .count()
    ).toStrictEqual(0);

    await Promise.all(
      newlyLikedBarks.map((id) =>
        Backend.likeBark({ user_id: dummyDbData.users[0]._id, bark_id: id })
      )
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[0]._id }).then((r) => r?.liked.length)
    ).toStrictEqual(originallyLikedBarks.length + newlyLikedBarks.length);

    expect(
      await barks
        .find({ _id: { $in: newlyLikedBarks }, likes: dummyDbData.users[0]._id })
        .count()
    ).toStrictEqual(newlyLikedBarks.length);
  });

  it('does not error if the user already liked the bark', async () => {
    expect.hasAssertions();

    await expect(
      Backend.unlikeBark({
        user_id: dummyDbData.users[0]._id,
        bark_id: dummyDbData.users[0].liked[0]
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, ndx]) =>
        expect(Backend.likeBark({ user_id, bark_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : bark_id))
        })
      )
    );
  });
});

describe('::createBark', () => {
  it('creates and returns a new bark', async () => {
    expect.hasAssertions();

    const items: NewBark[] = [
      {
        owner: dummyDbData.users[0]._id,
        content: '1',
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
      },
      {
        owner: dummyDbData.users[0]._id,
        content: Array.from({ length: 280 })
          .map(() => '6')
          .join(''),
        private: true,
        barkbackTo: null,
        rebarkOf: null
      }
    ];

    const newBarks = await Promise.all(
      items.map((data) => Backend.createBark({ key: Backend.DUMMY_KEY, data }))
    );

    const expectedInternalBarks = items.map<InternalBark>((item) => ({
      ...item,
      _id: expect.any(ObjectId),
      totalBarkbacks: 0,
      totalRebarks: 0,
      totalLikes: 0,
      createdAt: expect.any(Number),
      deleted: false,
      likes: [],
      meta: expect.objectContaining({
        creator: Backend.DUMMY_KEY,
        likeability: expect.any(Number),
        rebarkability: expect.any(Number),
        barkbackability: expect.any(Number)
      })
    }));

    expect(newBarks).toIncludeSameMembers(
      items.map((item) => expect.objectContaining(item))
    );

    expect(
      await (
        await getDb()
      )
        .collection<InternalBark>('barks')
        .find({ _id: { $in: newBarks.map((b) => new ObjectId(b.bark_id)) } })
        .toArray()
    ).toIncludeSameMembers(expectedInternalBarks);
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [NewBark, string][] = [
      [undefined as unknown as NewBark, 'only JSON'],
      ['string data' as unknown as NewBark, 'only JSON'],
      [{} as unknown as NewBark, 'invalid'],
      [{ data: 1 } as unknown as NewBark, 'invalid'],
      [{ content: '', createdAt: Date.now() } as unknown as NewBark, 'invalid'],
      [
        {
          owner: '',
          content: '',
          private: false
        } as unknown as NewBark,
        'invalid'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: '777',
          private: false
        } as unknown as NewBark,
        'invalid'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: '',
          private: false,
          barkbackTo: null,
          rebarkOf: null
        } as unknown as NewBark,
        'non-zero length string'
      ],
      [
        {
          owner: new ObjectId(),
          content: 'abc',
          private: false,
          barkbackTo: null,
          rebarkOf: null
        } as unknown as NewBark,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: '123',
          private: false,
          barkbackTo: new ObjectId(),
          rebarkOf: null
        } as unknown as NewBark,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false,
          barkbackTo: null,
          rebarkOf: new ObjectId()
        } as unknown as NewBark,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: 'rst',
          private: false,
          barkbackTo: false,
          rebarkOf: null
        } as unknown as NewBark,
        'invalid'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: 'def',
          private: false,
          barkbackTo: dummyDbData.barks[0]._id,
          rebarkOf: dummyDbData.barks[1]._id
        } as unknown as NewBark,
        'barks must be'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: Array.from({ length: 281 })
            .map(() => 'x')
            .join(''),
          private: false,
          barkbackTo: null,
          rebarkOf: null
        } as unknown as NewBark,
        '<= 280'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.createBark({ key: Backend.DUMMY_KEY, data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();

    await Backend.createBark({
      key: Backend.DUMMY_KEY,
      data: {
        owner: dummyDbData.users[0]._id,
        content: '1',
        private: false,
        barkbackTo: null,
        rebarkOf: null
      }
    });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalBarks)
    ).toBe(101);
  });
});

describe('::getAllUsers', () => {
  it('returns all users', async () => {
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

  it('rejects if id not found', async () => {
    expect.hasAssertions();
  });
});

describe('::deleteUser', () => {
  it('deletes a user', async () => {
    expect.hasAssertions();
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();
  });

  it('rejects if id not found', async () => {
    expect.hasAssertions();
  });
});

describe('::getFollowingUserIds', () => {
  it('returns users that a user is (directly) following', async () => {
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

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, after, ndx]) =>
        expect(
          Backend.getFollowingUserIds({ user_id, after, includeIndirect: false })
        ).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
        })
      )
    );
  });
});

describe('::isUserFollowing', () => {
  it('returns true iff the specified user is following the other', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, ndx]) =>
        expect(Backend.isUserFollowing({ user_id, followed_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : followed_id)
          )
        })
      )
    );
  });
});

describe('::followUser', () => {
  it('assigns the specified user as a follower of another', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user is already a follower', async () => {
    expect.hasAssertions();
  });

  it('user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, ndx]) =>
        expect(Backend.followUser({ user_id, followed_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : followed_id)
          )
        })
      )
    );
  });
});

describe('::unfollowUser', () => {
  it('removes the specified user as a follower of another', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user was never a follower', async () => {
    expect.hasAssertions();
  });

  it('user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, ndx]) =>
        expect(Backend.unfollowUser({ user_id, followed_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : followed_id)
          )
        })
      )
    );
  });
});

describe('::getPackmateUserIds', () => {
  it('returns packmates', async () => {
    expect.hasAssertions();
  });

  it('supports pagination', async () => {
    expect.hasAssertions();
  });

  it('functions when user has no packmates', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, after, ndx]) =>
        expect(Backend.getPackmateUserIds({ user_id, after })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
        })
      )
    );
  });
});

describe('::isUserPackmate', () => {
  it('returns true iff a user is in the pack', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, ndx]) =>
        expect(Backend.isUserPackmate({ user_id, packmate_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : packmate_id)
          )
        })
      )
    );
  });
});

describe('::addPackmate', () => {
  it('adds a user to the pack', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user is already in the pack', async () => {
    expect.hasAssertions();
  });

  it('user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, ndx]) =>
        expect(Backend.addPackmate({ user_id, packmate_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : packmate_id)
          )
        })
      )
    );
  });
});

describe('::removePackmate', () => {
  it('removes a user from the pack', async () => {
    expect.hasAssertions();
  });

  it('does not error if the user was never in the pack', async () => {
    expect.hasAssertions();
  });

  it('user metadata is updated', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, ndx]) =>
        expect(Backend.removePackmate({ user_id, packmate_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : packmate_id)
          )
        })
      )
    );
  });
});

describe('::getBookmarkedBarkIds', () => {
  it('returns barks that a user bookmarked', async () => {
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

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, after, ndx]) =>
        expect(Backend.getBookmarkedBarkIds({ user_id, after })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
        })
      )
    );
  });
});

describe('::isBarkBookmarked', () => {
  it('returns true iff a bark is bookmarked', async () => {
    expect.hasAssertions();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, ndx]) =>
        expect(Backend.isBarkBookmarked({ user_id, bark_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : bark_id))
        })
      )
    );
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

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, ndx]) =>
        expect(Backend.bookmarkBark({ user_id, bark_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : bark_id))
        })
      )
    );
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

    const items: [UserId, BarkId, number][] = [
      [new ObjectId(), dummyDbData.barks[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, bark_id, ndx]) =>
        expect(Backend.unbookmarkBark({ user_id, bark_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : bark_id))
        })
      )
    );
  });
});

describe('::createUser', () => {
  it('creates and returns a new user', async () => {
    expect.hasAssertions();

    const items: NewUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        username: 'uzr-1'
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null,
        username: 'uzr-2-12345678901234'
      },
      {
        name: 'three name',
        email: '3-three@email.address',
        phone: '333.333.3333 x5467',
        username: 'user_3'
      }
    ];

    const newUsers = await Promise.all(
      items.map((data) => Backend.createUser({ key: Backend.DUMMY_KEY, data }))
    );

    const expectedInternalUsers = items.map<InternalUser>((item) => ({
      ...item,
      _id: expect.any(ObjectId),
      deleted: false,
      bookmarked: [],
      following: [],
      packmates: [],
      liked: [],
      meta: expect.objectContaining({
        creator: Backend.DUMMY_KEY,
        followability: expect.any(Number),
        influence: expect.any(Number)
      })
    }));

    expect(newUsers).toIncludeSameMembers(
      items.map((item) => expect.objectContaining(item))
    );

    expect(
      await (
        await getDb()
      )
        .collection<InternalUser>('users')
        .find({ _id: { $in: newUsers.map((b) => new ObjectId(b.user_id)) } })
        .toArray()
    ).toIncludeSameMembers(expectedInternalUsers);
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [NewUser, string][] = [
      [undefined as unknown as NewUser, 'only JSON'],
      ['string data' as unknown as NewUser, 'only JSON'],
      [{} as unknown as NewUser, '3 and 30'],
      [{ data: 1 } as unknown as NewUser, '3 and 30'],
      [{ name: null } as unknown as NewUser, '3 and 30'],
      [{ name: 'my supercool name' } as unknown as NewUser, '5 and 50'],
      [
        {
          name: '#&*@^(#@(^$&*#',
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '3 and 30'
      ],
      [
        {
          name: 'tr',
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '3 and 30'
      ],
      [
        {
          name: Array.from({ length: 31 })
            .map(() => 'x')
            .join(''),
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '3 and 30'
      ],
      [
        {
          name: 'tre giles',
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: null,
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'invalid@email address',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'bad-email-address.here',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'validemailaddressbutitisway2big@who.woulddothis.com',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-$*#-&$^#',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-773-773',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: ''
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'fjdk'
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: false
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: Array.from({ length: 21 })
            .map(() => 'x')
            .join('')
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'xunnamius',
          admin: true
        } as unknown as NewUser,
        'unexpected properties'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.createUser({ key: Backend.DUMMY_KEY, data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();

    await Backend.createUser({
      key: Backend.DUMMY_KEY,
      data: {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        username: 'uzr-1'
      }
    });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalUsers)
    ).toBe(11);
  });
});

describe('::updateUser', () => {
  it('updates an existing user in the database', async () => {
    expect.hasAssertions();

    const items: PatchUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111'
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null
      },
      {
        name: 'three name',
        email: '3-three@email.address',
        phone: '333.333.3333 x5467'
      }
    ];

    await Promise.all(
      items.map((data, ndx) =>
        Backend.updateUser({ user_id: dummyDbData.users[ndx]._id, data })
      )
    );

    const users = (await getDb()).collection<InternalUser>('users');
    const patchedUserIds = itemToObjectId(dummyDbData.users.slice(0, items.length));

    expect(
      await users.find({ _id: { $in: patchedUserIds } }).toArray()
    ).toIncludeSameMembers(items.map((item) => expect.objectContaining(item)));
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [PatchUser, string][] = [
      [undefined as unknown as PatchUser, 'only JSON'],
      ['string data' as unknown as PatchUser, 'only JSON'],
      [{} as unknown as PatchUser, '3 and 30'],
      [{ data: 1 } as unknown as PatchUser, '3 and 30'],
      [{ name: null } as unknown as PatchUser, '3 and 30'],
      [{ name: 'my supercool name' } as unknown as PatchUser, '5 and 50'],
      [
        {
          name: '#&*@^(#@(^$&*#',
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: 'tr',
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: Array.from({ length: 31 })
            .map(() => 'x')
            .join(''),
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: 'tre giles',
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: null,
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'invalid@email address',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'bad-email-address.here',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'validemailaddressbutitisway2big@who.woulddothis.com',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-$*#-&$^#',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-773-773',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'xunnamius'
        } as unknown as PatchUser,
        'unexpected properties'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.updateUser({ user_id: new ObjectId(), data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('rejects if user_id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(
      Backend.updateUser({
        user_id: id,
        data: {
          name: 'one name',
          email: '1-one@email.address',
          phone: '111-111-1111'
        }
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::searchBarks', () => {
  it('returns all barks if no query params given', async () => {
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

    const keys = await Backend.getApiKeys();

    expect(keys).toIncludeSameMembers(
      dummyDbData.keys.map<InternalApiKey>((k) => ({
        owner: expect.any(String),
        key: expect.any(String)
      }))
    );

    expect(keys).toSatisfyAll((k: InternalApiKey) => k.key.length == 64);
  });
});

describe('::isKeyAuthentic', () => {
  it('returns true iff an API key is found in the system', async () => {
    expect.hasAssertions();

    expect(await Backend.isKeyAuthentic(Backend.NULL_KEY)).toBeFalse();
    expect(await Backend.isKeyAuthentic(Backend.DUMMY_KEY)).toBeTrue();
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
        key: Backend.DUMMY_KEY
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
      key: Backend.DUMMY_KEY,
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
        key: Backend.DUMMY_KEY
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
        key: Backend.DUMMY_KEY
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
