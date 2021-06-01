import { dummyDbData } from 'testverse/db';
import { testApiHandler } from 'next-test-api-route-handler';
import EndpointInfo, { config as ConfigInfo } from 'universe/pages/api/v1/info';
import { DUMMY_KEY as KEY } from 'universe/backend';

const api = {
  info: EndpointInfo as typeof EndpointInfo & { config?: typeof ConfigInfo }
};

api.info.config = ConfigInfo;
process.env.REQUESTS_PER_CONTRIVED_ERROR = '0';
process.env.DISABLED_API_VERSIONS = '';

describe('api/v1/info', () => {
  describe('/ [GET]', () => {
    it('returns summary system metadata', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.info,
        test: async ({ fetch }) => {
          const response = await fetch({ headers: { KEY } });
          const json = await response.json();

          expect(response.status).toBe(200);
          expect(json.success).toBe(true);
          expect(json.totalBarks).toStrictEqual(dummyDbData.info.totalBarks);
          expect(json.totalUsers).toStrictEqual(dummyDbData.info.totalUsers);
        }
      });
    });
  });
});
