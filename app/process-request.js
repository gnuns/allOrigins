const getPage = require('./get-page')

const DEFAULT_CACHE_TIME = 60 * 60 // 60 minutes
const MIN_CACHE_TIME = 5 * 60 // 5 minutes

module.exports = processRequest

async function processRequest(req, res) {
  const startTime = new Date()
  const params = parseParams(req)

  if (params.requestMethod === 'OPTIONS') {
    return res.end()
  }

  const page = await getPage(params)

  return createResponse(page, params, res, startTime)
}

function parseParams(req) {
  const params = {
    requestMethod: req.method,
    ...req.query,
    ...req.params,
  }
  params.requestMethod = parseRequestMethod(params.requestMethod)
  params.format = (params.format || 'json').toLowerCase()
  return params
}

function parseRequestMethod(method) {
  method = (method || '').toUpperCase()

  if (['HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].includes(method)) {
    return method
  }
  return 'GET'
}

function createResponse(page, params, res, startTime) {
  if (['GET', 'HEAD'].includes(params.requestMethod)) {
    res.set(
      'Cache-control',
      `public, max-age=${Math.max(
        MIN_CACHE_TIME,
        Number(params.cacheMaxAge) || DEFAULT_CACHE_TIME
      )}, stale-if-error=600`
    )
  }

  if (params.format === 'raw' && !(page.status || {}).error) {
    res.set({
      'Content-Length': page.contentLength,
      'Content-Type': page.contentType,
    })
    return res.send(page.content)
  }

  res.set(
    'Content-Type',
    `application/json; charset=${params.charset || 'utf-8'}`
  )

  if (page.status) {
    page.status.response_time = new Date() - startTime
  } else {
    page.response_time = new Date() - startTime
  }

  if (params.callback) {
    return res.jsonp(page)
  }

  return res.send(Buffer.from(JSON.stringify(page)))
}
