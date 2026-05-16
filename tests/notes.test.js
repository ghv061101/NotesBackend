const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/index');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('create note and enforce ownership', async () => {
  const email = 'note@example.com';
  const password = 'pass1234';

  const reg = await request(app).post('/api/auth/register').send({ email, password });
  const token = reg.body.token;

  const create = await request(app)
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'My note', content: 'hello' });
  expect(create.status).toBe(201);
  expect(create.body.title).toBe('My note');

  // another user cannot access the note
  const reg2 = await request(app).post('/api/auth/register').send({ email: 'other@example.com', password: 'abc12345' });
  const token2 = reg2.body.token;

  const list2 = await request(app).get('/api/notes').set('Authorization', `Bearer ${token2}`);
  expect(Array.isArray(list2.body)).toBe(true);
  expect(list2.body.length).toBe(0);
});
