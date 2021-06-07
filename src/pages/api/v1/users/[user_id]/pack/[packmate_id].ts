import { wrapHandler } from 'universe/backend/middleware';
import { addPackmate, isUserPackmate, removePackmate } from 'universe/backend';
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
      let packmate_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        packmate_id = new ObjectId(req.query.packmate_id.toString());
      } catch {
        sendHttpBadRequest(res, {
          error: `invalid packmate_id "${req.query.packmate_id.toString()}"`
        });
      }

      if (packmate_id !== undefined) {
        try {
          user_id = new ObjectId(req.query.user_id.toString());
        } catch {
          sendHttpBadRequest(res, {
            error: `invalid user_id "${req.query.user_id.toString()}"`
          });
        }

        if (user_id !== undefined) {
          if (req.method == 'GET') {
            (await isUserPackmate({ packmate_id, user_id }))
              ? sendHttpOk(res)
              : sendHttpNotFound(res);
          } else if (req.method == 'DELETE') {
            await removePackmate({ packmate_id, user_id });
            sendHttpOk(res);
          } else {
            await addPackmate({ packmate_id, user_id });
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
