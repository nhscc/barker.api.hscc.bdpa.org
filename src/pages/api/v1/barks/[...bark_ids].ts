import { handleEndpoint } from 'universe/backend/middleware';
import { getBarksById } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await handleEndpoint(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let ids: ObjectId[];

      try {
        const json: string[] = JSON.parse(req.query.ids.toString());
        ids = json
          .map((id) => {
            try {
              return new ObjectId(id);
            } catch {
              return null;
            }
          })
          .filter((id): id is ObjectId => id != null);

        sendHttpOk(res, {
          barks: await getBarksById({ key, ids })
        });
      } catch {
        sendHttpOk(res, { barks: [] });
      }
    },
    { req, res, methods: ['GET'], apiVersion: 1 }
  );
}
