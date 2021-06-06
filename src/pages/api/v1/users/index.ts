import { wrapHandler } from 'universe/backend/middleware';
import { createUser, getUsers } from 'universe/backend';
import { sendHttpBadRequest, sendHttpOk } from 'multiverse/next-respond';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let after: ObjectId | null | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        sendHttpBadRequest(res, {
          error: `invalid user_id "${req.query.after.toString()}"`
        });
      }

      if (after !== undefined) {
        if (req.method == 'GET') {
          sendHttpOk(res, { users: await getUsers({ key, after }) });
        } else sendHttpOk(res, { user: await createUser({ key, data: req.body }) });
      }
    },
    { req, res, methods: ['GET', 'POST'], apiVersion: 1 }
  );
}
