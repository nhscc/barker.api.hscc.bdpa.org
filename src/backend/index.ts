import { ObjectId } from 'mongodb';
import { getEnv } from 'universe/backend/env';
import { getDb } from 'universe/backend/db';
import { getClientIp } from 'request-ip';
import sha256 from 'crypto-js/sha256';

import {
  InvalidIdError,
  InvalidKeyError,
  GuruMeditationError,
  ValidationError
} from 'universe/backend/error';

import type { NextApiRequest } from 'next';
import type { WithId } from 'mongodb';

import type {
  RequestLogEntry,
  LimitedLogEntry,
  ApiKey,
  NextApiState,
  PublicBark,
  NewBark,
  PublicUser,
  PatchUser,
  NewUser,
  InternalInfo
} from 'types/global';

const isObject = (object: unknown) =>
  !Array.isArray(object) && object !== null && typeof object == 'object';

let requestCounter = 0;

export const NULL_KEY = '00000000-0000-0000-0000-000000000000';
export const DUMMY_KEY = '12349b61-83a7-4036-b060-213784b491';

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

const matchableSubStrings = ['$gt', '$lt', '$gte', '$lte'];

export async function isKeyAuthentic(key: string) {
  if (!key || typeof key != 'string') throw new InvalidKeyError();

  return !!(await (await getDb())
    .collection<WithId<ApiKey>>('keys')
    .find({ key })
    .limit(1)
    .count());
}

/**
 * Note that this async function does not have to be awaited. It's fire and
 * forget!
 */
export async function addToRequestLog({ req, res }: NextApiState) {
  const logEntry: RequestLogEntry = {
    ip: getClientIp(req),
    key: req.headers?.key?.toString() || null,
    method: req.method || null,
    route: req.url?.replace(/^\/api\//, '') || null,
    resStatusCode: res.statusCode,
    time: Date.now()
  };

  await (await getDb())
    .collection<WithId<RequestLogEntry>>('request-log')
    .insertOne(logEntry);
}

export async function isRateLimited(req: NextApiRequest) {
  const ip = getClientIp(req);
  const key = req.headers?.key?.toString() || null;

  const limited =
    (
      await (
        await getDb()
      )
        .collection<WithId<LimitedLogEntry>>('limited-log-mview')
        .find({
          $or: [...(ip ? [{ ip }] : []), ...(key ? [{ key }] : [])],
          until: { $gt: Date.now() }
        })
        .sort({ until: -1 })
        .limit(1)
        .toArray()
    )[0] || null;

  return {
    limited: !!limited,
    retryAfter: (limited?.until || Date.now()) - Date.now()
  };
}

export function isDueForContrivedError() {
  const reqPerErr = getEnv().REQUESTS_PER_CONTRIVED_ERROR;

  if (reqPerErr && ++requestCounter >= reqPerErr) {
    requestCounter = 0;
    return true;
  }

  return false;
}

export async function getApiKeys() {
  return (
    await (
      await getDb()
    )
      .collection<ApiKey>('keys')
      .find()
      .sort({ id: 1 })
      .project({
        _id: false
      })
      .toArray()
  ).map((apiKey) => ({ ...apiKey, key: sha256(apiKey.key).toString() }));
}

// TODO: env variables are respected (like contrived error)

export async function getSystemInfo(params: { key: string }): Promise<InternalInfo> {}

export async function getBarks(params: {
  key: string;
  bark_ids: ObjectId[];
}): Promise<PublicBark[]> {
  // const { ids, key } = params;
  // if (!Array.isArray(ids)) throw new IdTypeError();
  // if (ids.length > getEnv().RESULTS_PER_PAGE)
  //   throw new ValidationError('too many bark_ids specified');
  // if (!ids.every((id) => id instanceof ObjectId)) throw new IdTypeError();
  // if (!key || typeof key != 'string') throw new InvalidKeyError();
  // if (!ids.length) return [];
  // return (await getDb()).collection<WithId<InternalFlight>>('flights').aggregate<PublicFlight>([
  //     { $match: { _id: { $in: ids }}},
  //     ...pipelines.resolveFlightState(key, /*removeId=*/true)
  // ]).toArray();
}

export async function deleteBarks(params: {
  key: string;
  bark_ids: ObjectId[];
}): Promise<void> {}

export async function getBarkLikesUserIds(params: {
  key: string;
  bark_id: ObjectId;
  after: ObjectId | null;
}): Promise<string[]> {}

export async function getUserLikedBarkIds(params: {
  key: string;
  user_id: ObjectId;
  after: ObjectId | null;
}): Promise<string[]> {}

export async function isBarkLiked(params: {
  key: string;
  bark_id: ObjectId;
  user_id: ObjectId;
}): Promise<boolean> {}

export async function unlikeBark(params: {
  key: string;
  bark_id: ObjectId;
  user_id: ObjectId;
}): Promise<void> {}

export async function likeBark(params: {
  key: string;
  bark_id: ObjectId;
  user_id: ObjectId;
}): Promise<void> {}

export async function createBark(params: {
  key: string;
  data: NewBark;
}): Promise<PublicBark> {}

export async function getUsers(params: {
  key: string;
  after: ObjectId | null;
}): Promise<PublicUser[]> {}

export async function getUser(params: {
  key: string;
  user_id: ObjectId;
}): Promise<PublicUser> {}

export async function deleteUser(params: {
  key: string;
  user_id: ObjectId;
}): Promise<void> {}

export async function getFollowingUserIds(params: {
  key: string;
  user_id: ObjectId;
  include_indirect: boolean;
}): Promise<string[]> {}

export async function isUserFollowing(params: {
  key: string;
  user_id: ObjectId;
  followed_id: ObjectId;
}): Promise<boolean> {}

export async function followUser(params: {
  key: string;
  user_id: ObjectId;
  followed_id: ObjectId;
}): Promise<void> {}

export async function unfollowUser(params: {
  key: string;
  user_id: ObjectId;
  followed_id: ObjectId;
}): Promise<void> {}

export async function getPackmateUserIds(params: {
  key: string;
  user_id: ObjectId;
}): Promise<string[]> {}

export async function isUserPackmate(params: {
  key: string;
  user_id: ObjectId;
  packmate_id: ObjectId;
}): Promise<boolean> {}

export async function addPackmate(params: {
  key: string;
  user_id: ObjectId;
  packmate_id: ObjectId;
}): Promise<void> {}

export async function removePackmate(params: {
  key: string;
  user_id: ObjectId;
  packmate_id: ObjectId;
}): Promise<void> {}

export async function getBookmarkedBarkIds(params: {
  key: string;
  user_id: ObjectId;
}): Promise<string[]> {}

export async function isBarkBookmarked(params: {
  key: string;
  user_id: ObjectId;
  bark_id: ObjectId;
}): Promise<boolean> {}

export async function bookmarkBark(params: {
  key: string;
  user_id: ObjectId;
  bark_id: ObjectId;
}): Promise<void> {}

export async function unbookmarkBark(params: {
  key: string;
  user_id: ObjectId;
  bark_id: ObjectId;
}): Promise<void> {}

export async function createUser(params: {
  key: string;
  data: NewUser;
}): Promise<PublicUser> {}

export async function updateUser(params: {
  key: string;
  user_id: ObjectId;
  data: PatchUser;
}): Promise<void> {}

export async function searchBarks(params: {
  key: string;
  after: ObjectId | null;
  match: {
    [specifier: string]:
      | string
      | number
      | ObjectId
      | {
          [subspecifier in '$gt' | '$lt' | '$gte' | '$lte']?: string | number;
        };
  };
  regexMatch: {
    [specifier: string]: string | ObjectId;
  };
}) {
  const { key, after, match, regexMatch } = params;
  let regexMatchObjectIds: ObjectId[] = [];

  if (!key || typeof key != 'string') throw new InvalidKeyError();

  if (after !== null && !(after instanceof ObjectId)) throw new InvalidIdError(after);

  if (!isObject(match) || !isObject(regexMatch))
    throw new ValidationError('missing match and/or regexMatch');

  if (match._id) throw new ValidationError('invalid match object (1)');

  if (regexMatch._id) throw new ValidationError('invalid regexMatch object (1)');

  try {
    if (match.bark_id) {
      match._id = ObjectId(match.bark_id.toString());
      delete match.bark_id;
    }

    if (regexMatch.bark_id) {
      regexMatchObjectIds = regexMatch.bark_id
        .toString()
        .split('|')
        .map((oid) => ObjectId(oid));
      delete regexMatch.bark_id;
    }
  } catch {
    throw new ValidationError('bad bark_id encountered');
  }

  const matchKeys = Object.keys(match);
  const regexMatchKeys = Object.keys(regexMatch);

  const matchKeysAreValid = () =>
    matchKeys.every((ky) => {
      const val = match[ky];
      let valNotEmpty = false;

      const test = () =>
        Object.keys(val).every(
          (subky) =>
            (valNotEmpty = true) &&
            matchableSubStrings.includes(subky) &&
            typeof (val as Record<string, unknown>)[subky] == 'number'
        );

      return (
        !Array.isArray(val) &&
        matchableStrings.includes(ky) &&
        (val instanceof ObjectId ||
          ['number', 'string'].includes(typeof val) ||
          (isObject(val) && test() && valNotEmpty))
      );
    });

  const regexMatchKeysAreValid = () =>
    regexMatchKeys.every(
      (k) =>
        matchableStrings.includes(k) &&
        (regexMatch[k] instanceof ObjectId || typeof regexMatch[k] == 'string')
    );

  if (matchKeys.length && !matchKeysAreValid())
    throw new ValidationError('invalid match object (2)');

  if (regexMatchKeys.length && !regexMatchKeysAreValid())
    throw new ValidationError('invalid regexMatch object (2)');

  const primaryMatchers: Record<string, unknown> = {};
  const secondaryMatchers: Record<string, unknown> = {};

  // TODO: remove unnecessary code
  // ? We need to split off the search params that need flight state resolved
  // ? for both normal matchers and regex matchers (the latter takes
  // ? precedence due to code order)

  for (const [prop, val] of Object.entries(match)) {
    if (primaryMatchTargets.includes(prop)) primaryMatchers[prop] = val;
    else if (secondaryMatchTargets.includes(prop)) secondaryMatchers[prop] = val;
    else
      throw new GuruMeditationError(
        `matcher "${prop}" is somehow neither primary nor secondary (1)`
      );
  }

  for (const [prop, val] of Object.entries(regexMatch)) {
    const regexVal = { $regex: val, $options: 'i' };

    if (primaryMatchTargets.includes(prop)) primaryMatchers[prop] = regexVal;
    else if (secondaryMatchTargets.includes(prop)) secondaryMatchers[prop] = regexVal;
    else
      throw new GuruMeditationError(
        `matcher "${prop}" is somehow neither primary nor secondary (2)`
      );
  }

  const primaryMatchStage = {
    $match: {
      ...(after ? { _id: { $lt: ObjectId(after) } } : {}),
      ...primaryMatchers
    }
  };

  const pipeline = [
    ...(Object.keys(primaryMatchStage.$match).length ? [primaryMatchStage] : []),
    ...(regexMatchObjectIds.length
      ? [{ $match: { _id: { $in: regexMatchObjectIds } } }]
      : []),
    ...(Object.keys(secondaryMatchers).length
      ? [{ $match: { ...secondaryMatchers } }]
      : []),
    { $sort: { _id: -1 } },
    { $limit: getEnv().RESULTS_PER_PAGE },
    { $project: { _id: false } }
  ];

  return (await getDb())
    .collection<unknown>('flights') // TODO: update "unknown"
    .aggregate<unknown>(pipeline)
    .toArray();
}

export async function generateActivity(silent = false) {
  //const db = await getDb();
  void silent;
}
