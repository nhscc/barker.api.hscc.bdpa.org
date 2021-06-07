import { testApiHandler } from 'next-test-api-route-handler';
import { mockEnvFactory } from 'testverse/setup';

const withMockedEnv = mockEnvFactory({}, { replace: false });

describe('generic correctness tests', () => {
  test.todo('all endpoints fail on bad authentication');
  test.todo('server sends HTTP 555 on cue');
  void testApiHandler;
  void withMockedEnv;
});

// TODO: LIFO, 400/404, ignore 555
test.todo('create and validate, update and validate, query for, and delete users');

// TODO: LIFO, 400/404, ignore 555
test.todo(
  'create and validate, delete, and query many public/private barks/barkbacks/rebarks'
);

// TODO: LIFO, 400/404, ignore 555
test.todo('like/unlike and bookmark/unbookmark barks');

// TODO: LIFO, 400/404, ignore 555
test.todo('users follow/unfollow and pack/unpack one other');

// TODO: LIFO, 400/404, ignore 555
test.todo('versatile search capability');
