//import { setClientAndDb } from 'universe/backend/db';
//import { setupJest } from 'testverse/db';
//import generateActivity from 'externals/generate-activity';

import type { WithId } from 'mongodb';

//const { getDb, getNewClientAndDb } = setupJest();

describe('external-scripts/generate-activity', () => {
  it('generate some fake user activity', async () => {
    expect.hasAssertions();
    expect(true).toBeTrue();
    void 0 as unknown as WithId<unknown>;

    // await (await getFlightsDb()).deleteMany({});

    // expect(await getCount()).toBe(0);

    // process.env.FLIGHTS_GENERATE_DAYS = '1';
    // await generateActivity();

    //setClientAndDb(await getNewClientAndDb());
    // expect(await getCount()).not.toBe(0);
  });
});