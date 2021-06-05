import { sendHttpOk, sendHttpBadRequest } from 'multiverse/next-respond';
import { searchBarks } from 'universe/backend';
import { NotFoundError } from 'universe/backend/error';
import { wrapHandler } from 'universe/backend/middleware';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let after: ObjectId | null;
      let match: Record<string, unknown> | null = null;
      let regexMatch: Record<string, unknown> | null = null;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new NotFoundError(req.query.after.toString());
      }

      try {
        match = JSON.parse((req.query.match || '{}').toString());
        regexMatch = JSON.parse((req.query.regexMatch || '{}').toString());
      } catch (e) {
        sendHttpBadRequest(res, { error: `bad match or regexMatch: ${e}` });
      }

      if (!match || !regexMatch) return;

      const localSort = (req.query.sort || 'asc').toString();

      if (!['asc', 'desc'].includes(localSort))
        sendHttpBadRequest(res, { error: 'unrecognized sort option' });
      else {
        sendHttpOk(res, {
          barks: await searchBarks({
            key,
            after,
            // @ts-expect-error: validation is handled
            match,
            // @ts-expect-error: validation is handled
            regexMatch,
            sort: localSort as 'asc' | 'desc'
          })
        });
      }
    },
    { req, res, methods: ['GET'], apiVersion: 2 }
  );
}
