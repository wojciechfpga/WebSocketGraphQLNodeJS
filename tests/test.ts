import request from 'supertest';
import { mainapp } from '../src/server';

test('Fetch User', async () => {
  const res = await request(mainapp)
    .post('/graphql')
    .send({
      query: '{ user(id: "1") { name } }',
    });

  expect(res.body.data.user.name).toBe('John Doe');
});
