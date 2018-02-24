const request = require('request')
const zlib    = require('zlib')
const config  = require('./config')

module.exports = {
  processRequest: processRequest
}

function processRequest (req, res) {
  let start = new Date()
  let params = req.query

  if (!isValidURL(params.url)) {
    return res.status(400).json({'error': 'invalid url'})
  }
  if (params.method === 'info') {
    getPageData(params.url, true)
    .then((response) => {
      res.json({
        'url': unescape(params.url),
        'content_type': response.headers['content-type'],
        'content_length': parseInt(response.headers['content-length']) || -1,
        'http_code': response.statusCode
      })
    })
    .catch((err) => res.status(400).json({'error': err}))
    return
  }
  getPageData(params.url, false)
  .then((page) => {
    let contentLength = Buffer.byteLength(page.content)
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

    if (params.method && params.method === 'raw') {
      res.set('Content-Length', contentLength)
      res.set('Content-Type', page.response.headers['content-type'])
      return res.send(page.content)
    }
    if (params.charset) {
      res.set('Content-Type', `application/json charset=${params.charset}`)
    } else {
      res.set('Content-Type', 'application/json')
    }
    let responseObj = {
      contents: page.content.toString(),
      status: {
        'url': unescape(params.url),
        'content_type': page.response.headers['content-type'],
        'content_length': contentLength,
        'http_code': page.response.statusCode,
        'response_time': (new Date() - start)
      }
    }
    if (params.callback) return res.jsonp(responseObj)
    return res.send(JSON.stringify(responseObj))
  })
  .catch((err) => res.status(400).json({'error': err}))
}

function getPageData (url, infoOnly) {
  return new Promise(resolver)

  function resolver (resolve, reject) {
    let requesOptions = {
      'method': infoOnly ? 'HEAD' : 'GET',
      'url': url,
      'encoding': null,
      'headers': {
        'User-Agent': config.userAgent
      }
    }
    request(requesOptions, function (error, response) {
      if (error) return reject(error)
      if (infoOnly) return resolve(response)
      processContent(response)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
    })
  }
}

function processContent (response) {
  return new Promise(resolver)

  function resolver (resolve, reject) {
    let res = {'response': response, 'content': response.body}

    if (response.headers['content-encoding'] == 'gzip') {
      return zlib.gunzip(res.content, (err, dezipped) => {
        if (err) return reject(err)
        resolve(res)
      })
    }
    resolve(res)
  }
}

function isValidURL (str) {
  if (typeof str === 'undefined' || str.length <= 6) return false
	return /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i.test(str)
}
