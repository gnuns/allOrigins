const got = require('got')
const mcache = require('memory-cache')

const DEFAULT_USER_AGENT = `Mozilla/5.0 (compatible; allOrigins/${global.AO_VERSION}; +http://allorigins.ml/)`

module.exports = getPage

function getPage ({url, format, requestMethod}) {
  if (format === 'info' || requestMethod === 'HEAD') {
     return getPageInfo(url)
  } else if (format === 'raw') {
    return getRawPage(url, requestMethod)
  }

  return getPageContents(url, requestMethod)
}

async function getPageInfo (url) {
  const {response, error} = await request(url, 'HEAD')
  if (error) return processError(error)

  return {
    'url': url,
    'content_type': response.headers['content-type'],
    'content_length': +(response.headers['content-length']) || -1,
    'http_code': response.statusCode
  }
}

async function getRawPage (url, requestMethod) {
  const {content, response, error} = await request(url, requestMethod)
  if (error) return processError(error)

  const contentLength = Buffer.byteLength(content)
  return {content, contentType: response.headers['content-type'], contentLength}
}

async function getPageContents (url, requestMethod) {
  let key = '__express__' + url
  let cachedBody = mcache.get(key)
  var duration = 3600
  if (key === '__express__https://www.wuxiaworld.co/all/') (duration *= 24)
  if (cachedBody){
    const {content, response, error} = cachedBody
    if (error) return processError(error)

  const contentLength = Buffer.byteLength(content)
  return {
    contents: content.toString(),
    status: {
      'url': url,
      'content_type': response.headers['content-type'],
      'content_length': contentLength,
      'http_code': response.statusCode,
    }
  }
  } else {
    const {content, response, error} = await request(url, requestMethod)
    mcache.put(key, {content, response, error}, duration*1000)

    if (error) return processError(error)

  const contentLength = Buffer.byteLength(content)
  return {
    contents: content.toString(),
    status: {
      'url': url,
      'content_type': response.headers['content-type'],
      'content_length': contentLength,
      'http_code': response.statusCode,
    }
  }
  }
}

async function request (url, requestMethod) {
  try {
    const options = {
      'method': requestMethod,
      'encoding': null,
      'headers': {'user-agent': process.env.USER_AGENT || DEFAULT_USER_AGENT}
    }

    const response = await got(url, options)
    if (options.method === 'HEAD') return {response}

    return processContent(response)
  } catch (error) {
    return {error}
  }
}

async function processContent (response) {
  const res = {'response': response, 'content': response.body}
  return res
}

async function processError (e) {
  const {response} = e
  if (!response) return {contents: null, status: {error: e}}

  const {url, statusCode: http_code, headers, body} = response
  const contentLength = Buffer.byteLength(body)

  return {
    contents: body.toString(),
    status: {
      url, http_code,
      'content_type': headers['content-type'],
      'content_length': contentLength
    }
  }
}
