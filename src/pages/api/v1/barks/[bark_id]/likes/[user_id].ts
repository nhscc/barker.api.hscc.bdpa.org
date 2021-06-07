import { wrapHandler } from 'universe/backend/middleware';
import { isBarkLiked, likeBark, unlikeBark } from 'universe/backend';
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
      let bark_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        bark_id = new ObjectId(req.query.bark_id.toString());
      } catch {
        sendHttpBadRequest(res, {
          error: `invalid bark_id "${req.query.bark_id.toString()}"`
        });
      }

      if (bark_id !== undefined) {
        try {
          user_id = new ObjectId(req.query.user_id.toString());
        } catch {
          sendHttpBadRequest(res, {
            error: `invalid user_id "${req.query.user_id.toString()}"`
          });
        }

        if (user_id !== undefined) {
          if (req.method == 'GET') {
            (await isBarkLiked({ bark_id, user_id }))
              ? sendHttpOk(res)
              : sendHttpNotFound(res);
          } else if (req.method == 'DELETE') {
            await unlikeBark({ bark_id, user_id });
            sendHttpOk(res);
          } else {
            await likeBark({ bark_id, user_id });
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
