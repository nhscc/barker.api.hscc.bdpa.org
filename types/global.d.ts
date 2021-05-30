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

export type NextApiState<Payload = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<Payload>;
};

export type InternalInfo = {
  totalBarks: number;
  totalUsers: number;
};

/**
 * The shape of a Bark stored in MongoDb.
 */
export type InternalBark = {
  owner: UserId;
  content: string;
  createdAt: UnixEpochMs;
  likes: number;
  rebarks: number;
  barkbacks: number;
  deleted: boolean;
  private: boolean;
  barkbackTo: BarkId | null;
  rebarkOf: BarkId | null;
};

/**
 * The shape of a user stored in MongoDb.
 */
export type InternalUser = {
  name: string;
  email: string;
  phone: string;
  username: string;
  following: UserId[];
  packmates: UserId[];
  bookmarked: BarkId[];
  liked: BarkId[];
  deleted: boolean;
  personality: {
    /**
     * Max percentage of the generated user base that will _eventually_ follow
     * this user.
     *
     * @type number between 0 and 1
     */
    followability: number;
    /**
     * Max percentage of the generated user base that will _eventually_ follow
     * this user.
     *
     * @type number between 0 and 1
     */
    followability: number;
  };
};

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
 * The shape of a precomputed conversation.
 */
export type PrecomputedData = {
  dialogs: PrecomputedDialog[];
  usernames: string[];
};

export type PrecomputedDialog = {
  barks: PrecomputedBark[];
};

export type PrecomputedBark = {
  actor: 'A' | 'B';
  line: string;
};
