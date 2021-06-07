import { getUser, deleteUser, updateUser } from 'universe/backend';
import { sendHttpBadRequest, sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let user_id: ObjectId | undefined = undefined;

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        sendHttpBadRequest(res, {
          error: `invalid user_id "${req.query.user_id.toString()}"`
        });
      }

      if (user_id !== undefined) {
        if (req.method == 'GET') {
          sendHttpOk(res, { user: await getUser({ user_id }) });
        } else if (req.method == 'DELETE') {
          await deleteUser({ user_id });
          sendHttpOk(res);
        } else {
          await updateUser({ user_id, data: req.body });
          sendHttpOk(res);
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
