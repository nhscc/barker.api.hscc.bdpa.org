import type { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserId extends ObjectId {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BarkId extends ObjectId {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackmateId extends BarkId {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FollowedId extends BarkId {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnixEpochMs extends number {}

/**
 * A type combining NextApiRequest and NextApiResponse.
 */
export type NextApiState<Payload = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<Payload>;
};

/**
 * The shape of API metadata stored in MongoDb.
 */
export type InternalInfo = {
  totalBarks: number;
  totalUsers: number;
};

/**
 * The shape of a Bark stored in MongoDb.
 */
export type InternalBark = {
  /**
   * The ID of the user that created and owns this Bark.
   */
  owner: UserId;
  /**
   * The utf-8 content of this Bark.
   */
  content: string;
  /**
   * When this bark was created creation (milliseconds since unix epoch).
   */
  createdAt: UnixEpochMs;
  /**
   * A list of user IDs that liked this Bark.
   */
  likes: UserId[];
  /**
   * Integer number of likes this Bark has received. We'll cache this data
   * instead of calculating it via the aggregation for performance reasons.
   */
  totalLikes: number;
  /**
   * Integer number of rebarks this Bark has received. We'll cache this data
   * instead of calculating it via the aggregation for performance reasons.
   */
  totalRebarks: number;
  /**
   * Integer number of barkbacks this Bark has received. We'll cache this data
   * instead of calculating it via the aggregation for performance reasons.
   */
  totalBarkbacks: number;
  /**
   * If `true`, the user is for all intents and purposes non-existent in the
   * system.
   *
   * @default false
   */
  deleted: boolean;
  /**
   * If `true`, this Bark should only be visible to authorized users.
   *
   * @default false
   */
  private: boolean;
  /**
   * The ID of the Bark this Bark was created in response to.
   */
  barkbackTo: BarkId | null;
  /**
   * The ID of the Bark this Bark was copied ("rebarked") from.
   */
  rebarkOf: BarkId | null;
  /**
   * Metadata information only relevant to the server runtime and completely
   * opaque to API consumers.
   */
  meta: {
    /**
     * User Influence × 0.15 + Bark Likeability × 0.25 + .1 Pack Bonus = percent
     * chance of a generated follower liking a specific Bark from this user.
     *
     * @type number between 0 and 1
     */
    likeability: number;
    /**
     * User Influence × 0.10 + Bark "Rebarkability" × 0.20 + .1 Pack Bonus =
     * percent chance of a generated follower liking a specific Bark from this
     * user.
     *
     * @type number between 0 and 1
     */
    rebarkability: number;
    /**
     * User Influence × 0.10 + Bark "Barkbackability" × 0.15 + .15 Pack Bonus =
     * percent chance of a generated follower liking a specific Bark from this
     * user.
     *
     * @type number between 0 and 1
     */
    barkbackability: number;
  };
};

/**
 * The shape of a user stored in MongoDb.
 */
export type InternalUser = {
  /**
   * User first, full, etc name
   */
  name: string;
  /**
   * Email address
   */
  email: string;
  /**
   * Phone number
   */
  phone: string | null;
  /**
   * Username. Must be unique in the system.
   */
  username: string;
  /**
   * A list of user IDs in this user's pack.
   */
  packmates: UserId[];
  /**
   * A list of user IDs this user is following.
   */
  following: UserId[];
  /**
   * A list of Bark IDs bookmarked by this user.
   */
  bookmarked: BarkId[];
  /**
   * A list of Bark IDs that this user has liked.
   */
  liked: BarkId[];
  /**
   * If `true`, the user is for all intents and purposes non-existent in the
   * system.
   *
   * @default false
   */
  deleted: boolean;
  /**
   * Metadata information only relevant to the server runtime and completely
   * opaque to API consumers.
   */
  meta: {
    /**
     * Max percentage of the generated user base that will _eventually_ follow
     * this user.
     *
     * @type number between 0 (~1% of user base) and 1 (~75% of user base)
     */
    followability: number;
    /**
     * User Influence × 0.15 + Bark Likeability × 0.25 + .1 Pack Bonus = percent
     * chance of a generated follower liking a specific Bark from this user.
     *
     * @type number between 0 and 1
     */
    influence: number;
  };
};

/**
 * The shape of a publicly available Bark.
 */
export type PublicBark = Pick<
  InternalBark,
  'owner' | 'content' | 'createdAt' | 'deleted' | 'private' | 'barkbackTo' | 'rebarkOf'
> & {
  bark_id: string;
  likes: InternalBark['totalLikes'];
  rebarks: InternalBark['totalRebarks'];
  barkbacks: InternalBark['totalBarkbacks'];
};

/**
 * The shape of a publicly available user.
 */
export type PublicUser = Pick<
  InternalBark,
  'name' | 'email' | 'phone' | 'username' | 'deleted'
> & {
  user_id: string;
  packmates: number;
  following: number;
  bookmarked: number;
  liked: number;
};

/**
 * The shape of a newly received Bark.
 */
export type NewBark = Pick<
  InternalBark,
  'owner' | 'content' | 'private' | 'barkbackTo' | 'rebarkOf'
>;

/**
 * The shape of a newly received user.
 */
export type NewUser = Pick<InternalBark, 'name' | 'email' | 'phone' | 'username'>;

/**
 * The shape of a received update to an existing user.
 */
export type PatchUser = Pick<InternalBark, 'name' | 'email' | 'phone'>;

/**
 * The shape of an API key.
 */
export type ApiKey = {
  owner: string;
  key: string;
};

/**
 * The shape of a request log entry.
 */
export type RequestLogEntry = {
  ip: string | null;
  key: string | null;
  route: string | null;
  method: string | null;
  resStatusCode: number;
  time: number;
};

/**
 * The shape of a limited log entry.
 */
export type LimitedLogEntry =
  | {
      until: number;
      ip: string | null;
      key?: never;
    }
  | {
      until: number;
      ip?: never;
      key: string | null;
    };

/**
 * The shape of precomputed conversation corpus data.
 */
export type CorpusData = {
  dialogs: CorpusDialogLine[][];
  usernames: string[];
};

/**
 * The shape of a single line of precomputed conversation corpus data.
 */
export type CorpusDialogLine = {
  actor: 'A' | 'B';
  line: string;
};
