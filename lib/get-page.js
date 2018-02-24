const got = require('got')
const config  = require('../config')

module.exports = getPage

function getPage (url, method) {
  if (method === 'info') return getPageInfo(url)
  if (method === 'raw') return getRawPage(url)

  return getPageContents(url)
}

async function getPageInfo (url) {
  const {response, error} = await request(url, true)
  if (error) return processError(error)

  return {
    'url': unescape(url),
    'content_type': response.headers['content-type'],
    'content_length': +(response.headers['content-length']) || -1,
    'http_code': response.statusCode
  }
}

async function getRawPage (url) {
  const {content, response, error} = await request(url)
  if (error) return processError(error)

  const contentLength = Buffer.byteLength(content)
  return {content, contentType: response.headers['content-type'], contentLength}
}

async function getPageContents (url) {
  const {content, response, error} = await request(url)
  if (error) return processError(error)

  const contentLength = Buffer.byteLength(content)
  return {
    contents: content.toString(),
    status: {
      'url': unescape(url),
      'content_type': response.headers['content-type'],
      'content_length': contentLength,
      'http_code': response.statusCode,
    }
  }
}

async function request (url, infoOnly) {
  try {
    const response = await got(url, {
      'method': infoOnly ? 'HEAD' : 'GET',
      'encoding': null,
      'headers': {'user-agent': config.userAgent}
    })
    if (infoOnly) return response

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
  if (!response) return {content: null, status: {error: e}}

  const {url, statusCode: http_code, headers, body} = response
  const contentLength = Buffer.byteLength(body)

  return {
    content: body.toString(),
    status: {
      url, http_code,
      'content_type': headers['content-type'],
      'content_length': contentLength
    }
  }
}
