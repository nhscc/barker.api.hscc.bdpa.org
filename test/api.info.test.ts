import { testApiHandler } from 'next-test-api-route-handler';
import { DUMMY_KEY as KEY } from 'universe/backend';
import EndpointInfo, { config as ConfigInfo } from 'universe/pages/api/v1/info';

const api = {
  info: EndpointInfo as typeof EndpointInfo & { config?: typeof ConfigInfo }
};

api.info.config = ConfigInfo;

describe('api/v1/info', () => {
  describe('/ [GET]', () => {
    it('returns summary system metadata', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.info,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.json())).toStrictEqual({
            success: true,
            totalBarks: expect.any(Number),
            totalUsers: expect.any(Number)
          });
        }
      });
    });
  });
});
