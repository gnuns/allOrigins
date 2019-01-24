const request = require('supertest')
const nock = require('nock')
const app = require('../app.js')



beforeAll(() => {
  nock('http://example.com')
  .persist()
  .get('/test.html')
  .reply(200, 'Hi, allOrigins!')

  .get('/not-found.html')
  .reply(404, 'not found!')

  .post('/test.html')
  .reply(200, "Hi, allOrigins! It's a POST!")

  .head('/test.html')
  .reply(204, undefined, {'Content-Type': 'text/html', 'Content-Length': 'invalid'})
})

test('global.AO_VERSION is defined', () => {
  expect(global.AO_VERSION).toBeDefined()
})

test('Test basic /get request', async (done) => {
  const res = await request(app).get('/get?url=http://example.com/test.html')

  expect(res.statusCode).toBe(200)

  expect(res.body.contents).toBeDefined()
  expect(res.body.status).toBeDefined()
  expect(res.body.status.content_length).toBe(15)

  done()
})

test('Test POST to /get endpoint', async (done) => {
  const res = await request(app).post('/get?url=http://example.com/test.html')

  expect(res.statusCode).toBe(200)

  expect(res.body.contents).toBeDefined()
  expect(res.body.contents).toBe("Hi, allOrigins! It's a POST!")
  expect(res.body.status).toBeDefined()

  done()
})

test('Test /get request to not found url', async (done) => {
  const res = await request(app).get('/get?url=http://example.com/not-found.html')

  expect(res.statusCode).toBe(200)

  expect(res.body.contents).toBeDefined()
  expect(res.body.contents).toBe('not found!')
  expect(res.body.status).toBeDefined()
  expect(res.body.status.http_code).toBe(404)

  done()
})

test('Test /raw request', async (done) => {
  const res = await request(app).get('/raw?url=http://example.com/test.html')

  expect(res.statusCode).toBe(200)

  expect(res.body.contents).toBeUndefined()
  expect(res.body.status).toBeUndefined()
  expect(res.text).toBe('Hi, allOrigins!')
  done()
})

test('Test /info request', async (done) => {
  const res = await request(app).get('/info?url=http://example.com/test.html')

  expect(res.statusCode).toBe(200)

  expect(res.body.contents).toBeUndefined()
  expect(res.body.content_type).toBe('text/html')
  expect(res.body.content_length).toBe(-1)
  expect(res.body.http_code).toBe(204)

  done()
})

test('Test OPTIONS request', async (done) => {
  const RANDOM_ORIGIN = `https://${Math.random()}.random`

  const res = await request(app).options('/get').set('Origin', RANDOM_ORIGIN)

  expect(res.statusCode).toBe(200)
  // 'cause we accept requests from allOrigins :D
  expect(res.headers['access-control-allow-origin']).toBe(RANDOM_ORIGIN)
  expect(res.headers['access-control-allow-methods']).toBe('OPTIONS, GET, POST, PATCH, PUT, DELETE')

  expect(res.body.contents).toBeUndefined()

  done()
})
