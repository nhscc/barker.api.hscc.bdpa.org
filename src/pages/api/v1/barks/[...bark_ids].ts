import { wrapHandler } from 'universe/backend/middleware';
import { getBarks, deleteBarks } from 'universe/backend';
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
      let ids: ObjectId[] | undefined = undefined;

      try {
        ids = Array.from(
          new Set<ObjectId>(
            (req.query.bark_ids as string[]).map((id) => new ObjectId(id))
          )
        );
      } catch {
        sendHttpBadRequest(res, { error: 'invalid bark_id(s)' });
      }

      if (ids !== undefined) {
        if (req.method == 'GET') {
          const barks = await getBarks({ key, bark_ids: ids });

          if (barks.length != ids.length) {
            sendHttpNotFound(res, { error: 'duplicate or non-existent bark_id(s)' });
          } else sendHttpOk(res, { barks });
        } else {
          await deleteBarks({ key, bark_ids: ids });
          sendHttpOk(res);
        }
      }
    },
    {
      req,
      res,
      methods: ['GET', 'DELETE'],
      apiVersion: 1
    }
  );
}
