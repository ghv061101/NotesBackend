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

test('register and login flow', async () => {
  const email = 'test@example.com';
  const password = 'secret123';

  const reg = await request(app).post('/api/auth/register').send({ email, password });
  expect(reg.status).toBe(201);
  expect(reg.body.token).toBeDefined();

  const login = await request(app).post('/api/auth/login').send({ email, password });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeDefined();
});
