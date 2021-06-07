import sha256 from 'crypto-js/sha256';
import { ObjectId } from 'mongodb';
import { randomInt } from 'crypto';
import { toss } from 'toss-expression';
import { getClientIp } from 'request-ip';
import { getEnv } from 'universe/backend/env';
import { getDb, idExists, itemToObjectId, itemToStringId } from 'universe/backend/db';

import {
  InvalidIdError,
  InvalidKeyError,
  ValidationError,
  GuruMeditationError,
  NotFoundError,
  ItemNotFoundError
} from 'universe/backend/error';

import type { NextApiRequest } from 'next';
import type { WithId } from 'mongodb';

import type {
  InternalRequestLogEntry,
  InternalLimitedLogEntry,
  InternalApiKey,
  NextApiState,
  PublicBark,
  NewBark,
  PublicUser,
  PatchUser,
  NewUser,
  InternalInfo,
  InternalBark,
  InternalUser
} from 'types/global';

const isObject = (object: unknown) =>
  !Array.isArray(object) && object !== null && typeof object == 'object';

const nameRegex = /^[a-zA-Z0-9 -]+$/;
const emailRegex =
  // eslint-disable-next-line no-control-regex
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const phoneRegex =
  /^(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?$/;
const usernameRegex = /^[a-zA-Z0-9_-]{5,20}$/;

/**
 * Global (but only per serverless function instance) request counting state
 */
let requestCounter = 0;

/**
 * This key is guaranteed never to appear in the system and can be checked
 * against.
 */
export const NULL_KEY = '00000000-0000-0000-0000-000000000000';

/**
 * This key is only valid when running in a Jest test environment.
 */
export const DUMMY_KEY = '12349b61-83a7-4036-b060-213784b491';

/**
 * Bark properties that can be matched against with `searchBarks()`
 */
const matchableStrings = [
  'owner',
  'content',
  'createdAt',
  'totalLikes',
  'totalRebarks',
  'totalBarkbacks',
  'deleted',
  'private',
  'barkbackTo',
  'rebarkOf'
];

/**
 * Whitelisted MongoDB sub-matchers that can be used with `searchBarks()`
 */
const matchableSubStrings = ['$gt', '$lt', '$gte', '$lte'];

export const publicBarkProjection = {
  _id: false,
  bark_id: { $toString: '$_id' },
  likes: '$totalLikes',
  rebarks: '$totalRebarks',
  barkbacks: '$totalBarkbacks',
  owner: true,
  content: true,
  createdAt: true,
  deleted: true,
  private: true,
  barkbackTo: true,
  rebarkOf: true
};

export const publicUserProjection = {
  _id: false,
  user_id: { $toString: '$_id' },
  name: true,
  email: true,
  phone: true,
  username: true,
  packmates: { $size: '$packmates' },
  following: { $size: '$following' },
  bookmarked: { $size: '$bookmarked' },
  liked: { $size: '$liked' },
  deleted: true
};

export async function getSystemInfo(): Promise<InternalInfo> {
  return (
    (await (await getDb())
      .collection<InternalInfo>('info')
      .find()
      .project({ _id: false })
      .next()) ?? toss(new GuruMeditationError())
  );
}

export async function getBarks({
  bark_ids
}: {
  bark_ids: ObjectId[];
}): Promise<PublicBark[]> {
  if (!Array.isArray(bark_ids)) {
    throw new InvalidIdError();
  } else if (bark_ids.length > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError('too many bark_ids specified');
  } else if (!bark_ids.every((id) => id instanceof ObjectId)) {
    throw new InvalidIdError();
  } else if (!bark_ids.length) {
    return [];
  } else {
    const barks = await (
      await getDb()
    )
      .collection<InternalBark>('barks')
      .find({ _id: { $in: bark_ids } })
      .sort({ _id: -1 })
      .limit(getEnv().RESULTS_PER_PAGE)
      .project<PublicBark>(publicBarkProjection)
      .toArray();

    if (barks.length != bark_ids.length) {
      throw new NotFoundError('some or all bark_ids could not be found');
    } else return barks;
  }
}

export async function deleteBarks({ bark_ids }: { bark_ids: ObjectId[] }): Promise<void> {
  if (!Array.isArray(bark_ids)) {
    throw new InvalidIdError();
  } else if (bark_ids.length > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError('too many bark_ids specified');
  } else if (!bark_ids.every((id) => id instanceof ObjectId)) {
    throw new InvalidIdError();
  } else if (bark_ids.length) {
    const numUpdated = await (
      await getDb()
    )
      .collection<InternalBark>('barks')
      .updateMany({ _id: { $in: bark_ids } }, { $set: { deleted: true } })
      .then((r) => r.matchedCount);

    if (numUpdated != bark_ids.length) {
      throw new NotFoundError('some or all bark_ids could not be found');
    }
  }
}

export async function getBarkLikesUserIds({
  bark_id,
  after
}: {
  bark_id: ObjectId;
  after: ObjectId | null;
}): Promise<string[]> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const barks = db.collection<InternalBark>('barks');
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(barks, bark_id))) {
      throw new ItemNotFoundError(bark_id);
    } else if (after && !(await idExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await barks
        .find({ _id: bark_id })
        .project<{ likes: ObjectId[] }>({
          likes: {
            $slice: [
              '$likes',
              after ? { $sum: [{ $indexOfArray: ['$likes', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.likes))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function getUserLikedBarkIds({
  user_id,
  after
}: {
  user_id: ObjectId;
  after: ObjectId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');
    const barks = db.collection<InternalBark>('barks');

    if (!(await idExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await idExists(barks, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await users
        .find({ _id: user_id })
        .project<{ likes: ObjectId[] }>({
          likes: {
            $slice: [
              '$liked',
              after ? { $sum: [{ $indexOfArray: ['$liked', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.likes))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function isBarkLiked({
  bark_id,
  user_id
}: {
  bark_id: ObjectId;
  user_id: ObjectId;
}): Promise<boolean> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const barks = db.collection<InternalBark>('barks');
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(barks, bark_id))) throw new ItemNotFoundError(bark_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await barks
        .find({ _id: bark_id })
        .project<{ liked: boolean }>({
          liked: { $in: [user_id, '$likes'] }
        })
        .next()
        .then((r) => r?.liked)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function unlikeBark({
  bark_id,
  user_id
}: {
  bark_id: ObjectId;
  user_id: ObjectId;
}): Promise<void> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const barks = db.collection<InternalBark>('barks');
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(barks, bark_id))) throw new ItemNotFoundError(bark_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await Promise.all([
      users.updateOne({ _id: user_id }, { $pull: { liked: bark_id } }),
      barks.updateOne({ _id: bark_id }, { $pull: { likes: user_id } })
    ]);
  }
}

export async function likeBark({
  bark_id,
  user_id
}: {
  bark_id: ObjectId;
  user_id: ObjectId;
}): Promise<void> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const barks = db.collection<InternalBark>('barks');
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(barks, bark_id))) throw new ItemNotFoundError(bark_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await Promise.all([
      users.updateOne(
        { _id: user_id, liked: { $ne: bark_id } },
        { $push: { liked: { $each: [bark_id], $position: 0 } } }
      ),
      barks.updateOne(
        { _id: bark_id, liked: { $ne: bark_id } },
        { $push: { likes: { $each: [user_id], $position: 0 } } }
      )
    ]);
  }
}

export async function createBark({
  key,
  data
}: {
  key: string;
  data: Partial<NewBark>;
}): Promise<PublicBark> {
  if (!isObject(data)) {
    throw new ValidationError('only JSON content is allowed');
  } else if (!(data.owner instanceof ObjectId)) {
    throw new InvalidIdError('invalid user_id for `owner`');
  } else if (
    typeof data.content != 'string' ||
    !data.content.length ||
    data.content.length > 280
  ) {
    throw new ValidationError(
      '`content` must be a non-zero length string <= 280 characters'
    );
  } else if (typeof data.private != 'boolean') {
    throw new ValidationError('`private` must be a boolean');
  } else if (data.barkbackTo !== null && !(data.barkbackTo instanceof ObjectId)) {
    throw new ValidationError('invalid bark_id for `barkbackTo`');
  } else if (data.rebarkOf !== null && !(data.rebarkOf instanceof ObjectId)) {
    throw new ValidationError('invalid bark_id for `rebarkOf`');
  } else if (!key || typeof key != 'string') {
    throw new InvalidKeyError();
  }

  const { owner, content, private: p, barkbackTo, rebarkOf, ...rest } = data;

  const db = await getDb();
  const barks = db.collection<InternalBark>('barks');
  const users = db.collection<InternalUser>('users');

  if (Object.keys(rest).length > 0) {
    throw new ValidationError('unexpected properties encountered');
  } else if (barkbackTo && rebarkOf) {
    throw new ValidationError('barks must be either a bark-back or a rebark');
  } else if (!(await idExists(users, owner))) {
    throw new ItemNotFoundError(owner);
  } else if (barkbackTo && !(await idExists(barks, barkbackTo))) {
    throw new ItemNotFoundError(barkbackTo);
  } else if (rebarkOf && !(await idExists(barks, rebarkOf))) {
    throw new ItemNotFoundError(rebarkOf);
  }

  // * At this point, we can finally trust this data is not malicious
  const newBark: InternalBark = {
    owner,
    content,
    createdAt: Date.now(),
    likes: [],
    totalLikes: 0,
    totalRebarks: 0,
    totalBarkbacks: 0,
    deleted: false,
    private: p,
    barkbackTo,
    rebarkOf,
    meta: {
      creator: key,
      likeability: 1 / randomInt(100),
      rebarkability: 1 / randomInt(100),
      barkbackability: 1 / randomInt(100)
    }
  };

  await barks.insertOne(newBark);
  return getBarks({ bark_ids: [(newBark as WithId<InternalBark>)._id] }).then(
    (ids) => ids[0]
  );
}

export async function getAllUsers({
  after
}: {
  after: ObjectId | null;
}): Promise<PublicUser[]> {
  if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (after && !(await idExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return users
      .find(after ? { _id: { $lt: after } } : {})
      .sort({ _id: -1 })
      .limit(getEnv().RESULTS_PER_PAGE)
      .project<PublicUser>(publicUserProjection)
      .toArray();
  }
}

export async function getUser({ user_id }: { user_id: ObjectId }): Promise<PublicUser> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    return (
      (await users
        .find({ _id: user_id })
        .project<PublicUser>(publicUserProjection)
        .next()) ?? toss(new ItemNotFoundError(user_id))
    );
  }
}

export async function deleteUser({ user_id }: { user_id: ObjectId }): Promise<void> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError();
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);
    await users.updateOne({ _id: user_id }, { $set: { deleted: true } });
  }
}

export async function getFollowingUserIds({
  user_id,
  includeIndirect,
  after
}: {
  user_id: ObjectId;
  includeIndirect: boolean;
  after: ObjectId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else if (typeof includeIndirect != 'boolean') {
    throw new ValidationError('invalid type for includeIndirect');
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await idExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await users
        .find({ _id: user_id })
        .project<{ following: ObjectId[] }>({
          following: {
            $slice: [
              '$following',
              after ? { $sum: [{ $indexOfArray: ['$following', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.following))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function isUserFollowing({
  user_id,
  followed_id
}: {
  user_id: ObjectId;
  followed_id: ObjectId;
}): Promise<boolean> {
  if (!(followed_id instanceof ObjectId)) {
    throw new InvalidIdError(followed_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, followed_id))) throw new ItemNotFoundError(followed_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await users
        .find({ _id: user_id })
        .project<{ followed: boolean }>({
          followed: { $in: [followed_id, '$following'] }
        })
        .next()
        .then((r) => r?.followed)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function followUser({
  user_id,
  followed_id
}: {
  user_id: ObjectId;
  followed_id: ObjectId;
}): Promise<void> {
  if (!(followed_id instanceof ObjectId)) {
    throw new InvalidIdError(followed_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, followed_id))) throw new ItemNotFoundError(followed_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne(
      { _id: user_id },
      { $push: { following: { $each: [followed_id], $position: 0 } } }
    );
  }
}

export async function unfollowUser({
  user_id,
  followed_id
}: {
  user_id: ObjectId;
  followed_id: ObjectId;
}): Promise<void> {
  if (!(followed_id instanceof ObjectId)) {
    throw new InvalidIdError(followed_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, followed_id))) throw new ItemNotFoundError(followed_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne({ _id: user_id }, { $pull: { following: followed_id } });
  }
}

export async function getPackmateUserIds({
  user_id,
  after
}: {
  user_id: ObjectId;
  after: ObjectId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await idExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await users
        .find({ _id: user_id })
        .project<{ packmates: ObjectId[] }>({
          packmates: {
            $slice: [
              '$packmates',
              after ? { $sum: [{ $indexOfArray: ['$packmates', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.packmates))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function isUserPackmate({
  user_id,
  packmate_id
}: {
  user_id: ObjectId;
  packmate_id: ObjectId;
}): Promise<boolean> {
  if (!(packmate_id instanceof ObjectId)) {
    throw new InvalidIdError(packmate_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, packmate_id))) throw new ItemNotFoundError(packmate_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await users
        .find({ _id: user_id })
        .project<{ packmate: boolean }>({
          packmate: { $in: [packmate_id, '$packmates'] }
        })
        .next()
        .then((r) => r?.packmate)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function addPackmate({
  user_id,
  packmate_id
}: {
  user_id: ObjectId;
  packmate_id: ObjectId;
}): Promise<void> {
  if (!(packmate_id instanceof ObjectId)) {
    throw new InvalidIdError(packmate_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, packmate_id))) throw new ItemNotFoundError(packmate_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne(
      { _id: user_id },
      { $push: { packmates: { $each: [packmate_id], $position: 0 } } }
    );
  }
}

export async function removePackmate({
  user_id,
  packmate_id
}: {
  user_id: ObjectId;
  packmate_id: ObjectId;
}): Promise<void> {
  if (!(packmate_id instanceof ObjectId)) {
    throw new InvalidIdError(packmate_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(users, packmate_id))) throw new ItemNotFoundError(packmate_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne({ _id: user_id }, { $pull: { packmates: packmate_id } });
  }
}

export async function getBookmarkedBarkIds({
  user_id,
  after
}: {
  user_id: ObjectId;
  after: ObjectId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');
    const barks = db.collection<InternalBark>('barks');

    if (!(await idExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await idExists(barks, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await users
        .find({ _id: user_id })
        .project<{ bookmarked: ObjectId[] }>({
          bookmarked: {
            $slice: [
              '$bookmarked',
              after ? { $sum: [{ $indexOfArray: ['$bookmarked', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.bookmarked))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function isBarkBookmarked({
  user_id,
  bark_id
}: {
  user_id: ObjectId;
  bark_id: ObjectId;
}): Promise<boolean> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const barks = db.collection<InternalBark>('barks');
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(barks, bark_id))) throw new ItemNotFoundError(bark_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await users
        .find({ _id: user_id })
        .project<{ bookmarked: boolean }>({
          bookmarked: { $in: [bark_id, '$bookmarked'] }
        })
        .next()
        .then((r) => r?.bookmarked)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function bookmarkBark({
  user_id,
  bark_id
}: {
  user_id: ObjectId;
  bark_id: ObjectId;
}): Promise<void> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const barks = db.collection<InternalBark>('barks');
    const users = db.collection<InternalUser>('users');

    if (!(await idExists(barks, bark_id))) throw new ItemNotFoundError(bark_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne(
      { _id: user_id },
      { $push: { bookmarked: { $each: [bark_id], $position: 0 } } }
    );
  }
}

export async function unbookmarkBark({
  user_id,
  bark_id
}: {
  user_id: ObjectId;
  bark_id: ObjectId;
}): Promise<void> {
  if (!(bark_id instanceof ObjectId)) {
    throw new InvalidIdError(bark_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');
    const barks = db.collection<InternalBark>('barks');

    if (!(await idExists(barks, bark_id))) throw new ItemNotFoundError(bark_id);
    if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne({ _id: user_id }, { $pull: { bookmarked: bark_id } });
  }
}

export async function createUser({
  key,
  data
}: {
  key: string;
  data: Partial<NewUser>;
}): Promise<PublicUser> {
  if (!isObject(data)) {
    throw new ValidationError('only JSON content is allowed');
  } else if (
    typeof data.name != 'string' ||
    data.name.length < 3 ||
    data.name.length > 30 ||
    !nameRegex.test(data.name)
  ) {
    throw new ValidationError(
      '`name` must be an alphanumeric string between 3 and 30 characters'
    );
  } else if (
    typeof data.email != 'string' ||
    data.email.length < 5 ||
    data.email.length > 50 ||
    !emailRegex.test(data.email)
  ) {
    throw new ValidationError(
      '`email` must be a valid email address between 5 and 50 characters'
    );
  } else if (
    data.phone !== null &&
    (typeof data.phone != 'string' || !phoneRegex.test(data.phone))
  ) {
    throw new ValidationError('`phone` must be a valid phone number');
  } else if (typeof data.username != 'string' || !usernameRegex.test(data.username)) {
    throw new ValidationError(
      '`username` must be an alphanumeric string between 5 and 20 characters'
    );
  }

  const { email, name, phone, username, ...rest } = data;

  if (Object.keys(rest).length > 0)
    throw new ValidationError('unexpected properties encountered');

  // * At this point, we can finally trust this data is not malicious
  const newUser: InternalUser = {
    name,
    email,
    phone,
    username,
    packmates: [],
    following: [],
    bookmarked: [],
    liked: [],
    deleted: false,
    meta: {
      creator: key,
      followability: 1 / randomInt(100),
      influence: 1 / randomInt(100)
    }
  };

  await (await getDb()).collection<InternalUser>('users').insertOne(newUser);
  return getUser({ user_id: (newUser as WithId<InternalUser>)._id });
}

// TODO: factor out the validation code for both user creation and update (DRY)
export async function updateUser({
  user_id,
  data
}: {
  user_id: ObjectId;
  data: Partial<PatchUser>;
}): Promise<void> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (!isObject(data)) {
    throw new ValidationError('only JSON content is allowed');
  } else if (
    typeof data.name != 'string' ||
    data.name.length < 3 ||
    data.name.length > 30 ||
    !nameRegex.test(data.name)
  ) {
    throw new ValidationError(
      '`name` must be an alphanumeric string between 3 and 30 characters'
    );
  } else if (
    typeof data.email != 'string' ||
    data.email.length < 5 ||
    data.email.length > 50 ||
    !emailRegex.test(data.email)
  ) {
    throw new ValidationError(
      '`email` must be a valid email address between 5 and 50 characters'
    );
  } else if (
    data.phone !== null &&
    (typeof data.phone != 'string' || !phoneRegex.test(data.phone))
  ) {
    throw new ValidationError('`phone` must be a valid phone number');
  }

  const { email, name, phone, ...rest } = data;

  if (Object.keys(rest).length > 0)
    throw new ValidationError('unexpected properties encountered');

  // * At this point, we can finally trust this data is not malicious
  const patchUser: PatchUser = { name, email, phone };

  const db = await getDb();
  const users = db.collection<InternalUser>('users');

  if (!(await idExists(users, user_id))) throw new ItemNotFoundError(user_id);
  await users.updateOne({ _id: user_id }, { $set: patchUser });
}

export async function searchBarks({
  after,
  match,
  regexMatch
}: {
  after: ObjectId | null;
  match: {
    [specifier: string]:
      | string
      | number
      | {
          [subspecifier in '$gt' | '$lt' | '$gte' | '$lte']?: number;
        };
  };
  regexMatch: {
    [specifier: string]: string;
  };
}) {
  // ? Initial validation

  if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else if (!isObject(match) || !isObject(regexMatch)) {
    throw new ValidationError('missing match and/or regexMatch');
  } else if (match._id || match.bark_id || match.user_id) {
    throw new ValidationError('match object has an illegal X_id property');
  } else if (regexMatch._id || regexMatch.bark_id || regexMatch.user_id) {
    throw new ValidationError('regexMatch object has an illegal X_id property');
  }

  // ? Handle aliasing/proxying

  const enableProxyMatches = (m: typeof regexMatch | typeof match) => {
    if (m.likes) {
      m.totalLikes = m.likes;
      delete m.likes;
    }

    if (m.rebarks) {
      m.totalRebarks = m.rebarks;
      delete m.rebarks;
    }

    if (m.barkbacks) {
      m.totalBarkbacks = m.barkbacks;
      delete m.barkbacks;
    }
  };

  enableProxyMatches(match);
  enableProxyMatches(regexMatch);

  // ? Transform all the "or" queries that might appear in regular expressions

  type ValidMatchId = 'owner' | 'barkbackTo' | 'rebarkOf';
  const matchIds = {} as Record<ValidMatchId, ObjectId[]>;
  const split = (str: string) => str.toString().split('|');

  if (regexMatch.owner) {
    matchIds['owner'] = itemToObjectId(split(regexMatch.owner));
    delete regexMatch.owner;
  }

  if (regexMatch.barkbackTo) {
    matchIds['barkbackTo'] = itemToObjectId(split(regexMatch.barkbackTo));
    delete regexMatch.barkbackTo;
  }

  if (regexMatch.rebarkOf) {
    matchIds['rebarkOf'] = itemToObjectId(split(regexMatch.rebarkOf));
    delete regexMatch.rebarkOf;
  }

  // ? Next, we validate everything

  const matchKeys = Object.keys(match);
  const regexMatchKeys = Object.keys(regexMatch);

  const matchKeysAreValid = () =>
    matchKeys.every((ki) => {
      const val = match[ki];
      let valNotEmpty = false;

      const test = () => {
        return Object.keys(val).every(
          (subki) =>
            (valNotEmpty = true) &&
            matchableSubStrings.includes(subki) &&
            typeof (val as Record<string, unknown>)[subki] == 'number'
        );
      };

      return (
        !Array.isArray(val) &&
        matchableStrings.includes(ki) &&
        (val instanceof ObjectId ||
          ['number', 'string'].includes(typeof val) ||
          (isObject(val) && test() && valNotEmpty))
      );
    });

  const regexMatchKeysAreValid = () =>
    regexMatchKeys.every((ki) => {
      return (
        matchableStrings.includes(ki) &&
        ((regexMatch[ki] as unknown) instanceof ObjectId ||
          typeof regexMatch[ki] == 'string')
      );
    });

  if (matchKeys.length && !matchKeysAreValid())
    throw new ValidationError('match object validation failed');

  if (regexMatchKeys.length && !regexMatchKeysAreValid())
    throw new ValidationError('regexMatch object validation failed');

  // ? Finally, we construct the pristine params objects and perform the search

  const finalRegexMatch = {} as Record<string, unknown>;

  Object.entries(regexMatch).map(([k, v]) => {
    finalRegexMatch[k] = { $regex: v, $options: 'i' };
  });

  const primaryMatchStage = {
    $match: {
      ...(after ? { _id: { $lt: after } } : {}),
      ...match,
      ...finalRegexMatch
    }
  };

  return (await getDb())
    .collection<InternalBark>('barks')
    .aggregate<PublicBark>([
      ...(Object.keys(primaryMatchStage).length ? [primaryMatchStage] : []),
      ...Object.entries(matchIds).map(([k, v]) => ({ $match: { [k]: { $in: v } } })),
      { $sort: { _id: -1 } },
      { $limit: getEnv().RESULTS_PER_PAGE },
      { $project: publicBarkProjection }
    ])
    .toArray();
}

export async function isKeyAuthentic(key: string) {
  if (!key || typeof key != 'string') throw new InvalidKeyError();

  return (await getDb())
    .collection<InternalApiKey>('keys')
    .findOne({ key })
    .then((r) => !!r);
}

/**
 * Note that this async function does not have to be awaited. It's fire and
 * forget!
 */
export async function addToRequestLog({ req, res }: NextApiState) {
  await (await getDb()).collection<InternalRequestLogEntry>('request-log').insertOne({
    ip: getClientIp(req),
    key: req.headers?.key?.toString() || null,
    method: req.method || null,
    route: req.url?.replace(/^\/api\//, '') || null,
    resStatusCode: res.statusCode,
    time: Date.now()
  });
}

export async function isRateLimited(req: NextApiRequest) {
  const ip = getClientIp(req);
  const key = req.headers?.key?.toString() || null;

  const limited = await (
    await getDb()
  )
    .collection<InternalLimitedLogEntry>('limited-log-mview')
    .find({
      $or: [...(ip ? [{ ip }] : []), ...(key ? [{ key }] : [])],
      until: { $gt: Date.now() } // ? Skip the recently unbanned
    })
    .sort({ until: -1 })
    .limit(1)
    .next();

  return {
    limited: !!limited,
    retryAfter: (limited?.until || Date.now()) - Date.now()
  };
}

/**
 * Note that this is a per-serverless-function request counter and not global
 * across all Vercel virtual machines.
 */
export function isDueForContrivedError() {
  const reqPerErr = getEnv().REQUESTS_PER_CONTRIVED_ERROR;

  if (reqPerErr && ++requestCounter >= reqPerErr) {
    requestCounter = 0;
    return true;
  }

  return false;
}

export async function getApiKeys() {
  return (await getDb())
    .collection<InternalApiKey>('keys')
    .find()
    .sort({ _id: 1 })
    .project({
      _id: false
    })
    .toArray()
    .then((a) => a.map((apiKey) => ({ ...apiKey, key: sha256(apiKey.key).toString() })));
}
