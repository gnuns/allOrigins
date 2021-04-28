const request = require('supertest')
const nock = require('nock')
const app = require('../app.js')

beforeAll(() => {
  nock('http://example.com')
    .persist(true)
    .get('/test.html')
    .reply(200, 'Hi, allOrigins!', {
      'Content-Type': 'text/html',
    })

    .get('/test.txt')
    .reply(200, 'Hello, allOrigins! 👽', {
      'Content-Type': 'text/plain',
    })

    .get('/cn.txt')
    .reply(200, Buffer.from('C4E3BAC3CAC0BDE7A3A1', 'hex'), {
      'Content-Type': 'text/plain',
    })

    .get('/not-found.html')
    .reply(404, 'not found!')

    .post('/test.html')
    .reply(200, "Hi, allOrigins! It's a POST!")

    .head('/test.html')
    .reply(204, undefined, {
      'Content-Type': 'text/html',
      'Content-Length': 'invalid',
    })
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
  const res = await request(app).get(
    '/get?url=http://example.com/not-found.html'
  )

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

test('Test /get request with charset param', async (done) => {
  const res = await request(app).get(
    '/get?url=http://example.com/test.txt&charset=utf-8'
  )

  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toBe('application/json; charset=utf-8')

  expect(res.body.contents).toBe('Hello, allOrigins! 👽')
  done()
})

test('Test /get request with charset param (CN)', async (done) => {
  const res = await request(app).get(
    '/get?url=http://example.com/cn.txt&charset=gbk'
  )

  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toBe('application/json; charset=gbk')

  expect(res.body.contents).toBe('你好世界！')
  done()
})

test('Test /get request with callback param', async (done) => {
  const res = await request(app).get(
    '/get?url=http://example.com/test.txt&callback=myFunc'
  )

  expect(res.statusCode).toBe(200)
  expect(res.headers['content-type']).toBe('text/javascript; charset=utf-8')

  expect(res.text).toMatch(/myFunc\(\{.+\}\)/gi)
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
  expect(res.headers['access-control-allow-methods']).toBe(
    'OPTIONS, GET, POST, PATCH, PUT, DELETE'
  )

  expect(res.body.contents).toBeUndefined()

  done()
})

test('with disableCache', async (done) => {
  const res = await request(app).get(
    `/get?url=http://example.com/test.html&disableCache=true`
  )

  expect(res.statusCode).toBe(200)
  expect(res.headers['cache-control']).toBe(
    `public, max-age=0, stale-if-error=600`
  )

  expect(res.body.contents).toBeDefined()
  expect(res.body.status).toBeDefined()
  expect(res.body.status.content_length).toBe(15)

  done()
})

test('with disableCache and valid cacheMaxAge', async (done) => {
  const res = await request(app).get(
    `/get?url=http://example.com/test.html&disableCache=true&cacheMaxAge=1000`
  )

  expect(res.statusCode).toBe(200)
  expect(res.headers['cache-control']).toBe(
    `public, max-age=0, stale-if-error=600`
  )

  expect(res.body.contents).toBeDefined()
  expect(res.body.status).toBeDefined()
  expect(res.body.status.content_length).toBe(15)

  done()
})

describe.each([
  ['without cacheMaxAge', '', '3600'],
  ['with a valid cacheMaxAge', '342', '342'],
  ['with an invalid cacheMaxAge', 'not-valid', '3600'],
  ['with a cacheMaxAge < MIN_CACHE_TIME', '142', '300'],
])('%s', (_, param, expected) => {
  test('Test /raw request', async (done) => {
    const res = await request(app).get(
      `/raw?url=http://example.com/test.html&cacheMaxAge=${param}`
    )

    expect(res.statusCode).toBe(200)
    expect(res.headers['cache-control']).toBe(
      `public, max-age=${expected}, stale-if-error=600`
    )

    expect(res.body.contents).toBeUndefined()
    expect(res.body.status).toBeUndefined()
    expect(res.text).toBe('Hi, allOrigins!')
    done()
  })

  test('Test /get request', async (done) => {
    const res = await request(app).get(
      `/get?url=http://example.com/test.html&cacheMaxAge=${param}`
    )

    expect(res.statusCode).toBe(200)
    expect(res.headers['cache-control']).toBe(
      `public, max-age=${expected}, stale-if-error=600`
    )

    expect(res.body.contents).toBeDefined()
    expect(res.body.status).toBeDefined()
    expect(res.body.status.content_length).toBe(15)

    done()
  })

  test('Test POST to /json endpoint', async (done) => {
    const res = await request(app).post(
      `/json?url=http://example.com/test.html&cacheMaxAge=${param}`
    )

    expect(res.statusCode).toBe(200)
    expect(res.headers['cache-control']).toBeUndefined()

    expect(res.body.contents).toBeDefined()
    expect(res.body.contents).toBe("Hi, allOrigins! It's a POST!")
    expect(res.body.status).toBeDefined()

    done()
  })
})
