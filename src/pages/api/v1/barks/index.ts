import { handleEndpoint } from 'universe/backend/middleware';
import { searchBarks } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { NotFoundError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await handleEndpoint(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let after: ObjectId | null;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new NotFoundError(req.query.after.toString());
      }

      sendHttpOk(res, {
        barks: await searchBarks({
          key,
          after,
          match: {},
          regexMatch: {}
        })
      });
    },
    { req, res, methods: ['GET'], apiVersion: 1 }
  );
}
