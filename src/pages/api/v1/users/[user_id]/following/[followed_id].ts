import { wrapHandler } from 'universe/backend/middleware';
import { followUser, isUserFollowing, unfollowUser } from 'universe/backend';
import { ObjectId } from 'mongodb';

import {
  sendHttpBadRequest,
  sendHttpNotFound,
  sendHttpOk
} from 'multiverse/next-respond';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let followed_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        followed_id = new ObjectId(req.query.followed_id.toString());
      } catch {
        sendHttpBadRequest(res, {
          error: `invalid user_id "${req.query.followed_id.toString()}"`
        });
      }

      if (followed_id !== undefined) {
        try {
          user_id = new ObjectId(req.query.user_id.toString());
        } catch {
          sendHttpBadRequest(res, {
            error: `invalid user_id "${req.query.user_id.toString()}"`
          });
        }

        if (user_id !== undefined) {
          if (req.method == 'GET') {
            (await isUserFollowing({ key, followed_id, user_id }))
              ? sendHttpOk(res)
              : sendHttpNotFound(res);
          } else if (req.method == 'DELETE') {
            await unfollowUser({ key, followed_id, user_id });
            sendHttpOk(res);
          } else {
            await followUser({ key, followed_id, user_id });
            sendHttpOk(res);
          }
        }
      }
    },
    {
      req,
      res,
      methods: ['GET'],
      apiVersion: 1
    }
  );
}
