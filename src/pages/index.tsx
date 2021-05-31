import * as React from 'react';
import { getEnv } from 'universe/backend/env';
import { getDb, initializeDb, destroyDb } from 'universe/backend/db';
import { hydrateDb, unhydratedDummyDbData } from 'testverse/db';

import type { GetServerSidePropsContext } from 'next';

type Props = {
  previouslyHydratedDb: boolean;
  shouldHydrateDb: boolean;
  isInProduction: boolean;
  nodeEnv: string;
};

let previouslyHydratedDb = false;

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const env = getEnv();
  const shouldHydrateDb =
    env.NODE_ENV == 'development' &&
    ((!previouslyHydratedDb && env.HYDRATE_DB_ON_STARTUP) || query.hydrate !== undefined);

  const props = {
    isInProduction: env.NODE_ENV == 'production',
    shouldHydrateDb,
    previouslyHydratedDb,
    nodeEnv: env.NODE_ENV
  };

  if (shouldHydrateDb) {
    const db = await getDb();

    await destroyDb(db);
    await initializeDb(db);
    await hydrateDb(db, unhydratedDummyDbData);
    previouslyHydratedDb = true;
  }

  return { props };
}

export default function Index({
  previouslyHydratedDb,
  shouldHydrateDb,
  isInProduction,
  nodeEnv
}: Props) {
  let status = <span style={{ color: 'gray' }}>unchanged</span>;

  if (previouslyHydratedDb)
    status = <span style={{ color: 'green' }}>previously hydrated</span>;

  if (shouldHydrateDb) status = <span style={{ color: 'darkred' }}>hydrated</span>;

  // TODO: remove me
  // eslint-disable-next-line no-console
  console.log(`node runtime version ${process.version}`);

  return (
    <React.Fragment>
      <p>Psst: there is no web frontend for this API.</p>
      {!isInProduction && (
        <p>
          <strong>
            {`[ NODE_ENV=${nodeEnv} | db=`}
            {status}
            {' ]'}
          </strong>
        </p>
      )}
    </React.Fragment>
  );
}
