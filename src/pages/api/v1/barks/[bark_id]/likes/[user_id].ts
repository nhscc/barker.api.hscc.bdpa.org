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
      const key = req.headers.key?.toString() || '';
      let after: ObjectId | null | undefined = undefined;
      let bark_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        sendHttpBadRequest(res, {
          error: `invalid bark_id "${req.query.after.toString()}"`
        });
      }

      if (after !== undefined) {
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
              (await isBarkLiked({ key, bark_id, user_id }))
                ? sendHttpOk(res)
                : sendHttpNotFound(res);
            } else if (req.method == 'DELETE') {
              await unlikeBark({ key, bark_id, user_id });
              sendHttpOk(res);
            } else {
              await likeBark({ key, bark_id, user_id });
              sendHttpOk(res);
            }
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
