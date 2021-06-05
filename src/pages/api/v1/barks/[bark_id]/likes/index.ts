import { getBarkLikesUserIds } from 'universe/backend';
import { sendHttpBadRequest, sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let after: ObjectId | null | undefined = undefined;
      let bark_id: ObjectId | undefined = undefined;

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
          sendHttpOk(res, { users: await getBarkLikesUserIds({ key, bark_id, after }) });
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
