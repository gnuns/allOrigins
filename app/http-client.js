const HttpAgent = require('agentkeepalive')
const QuickLRU = require('../vendor/quick-lru')
const got = require('got')

const DEFAULT_USER_AGENT = `Mozilla/5.0 (compatible; allOrigins/${global.AO_VERSION}; +http://allorigins.win/)`

module.exports = (function defaultGot() {
  const gotOptions = {
    agent: {
      http: new HttpAgent({
        keepAlive: false,
      }),
      https: new HttpAgent.HttpsAgent({
        keepAlive: false,
      }),
    },
    responseType: 'buffer',
    dnsCache: true,
    headers: { 'user-agent': process.env.USER_AGENT || DEFAULT_USER_AGENT },
  }

  if (process.env.ENABLE_REDIS === '1' || true) {
    gotOptions.cacheOptions = {
      shared: true,
      cacheHeuristic: 0.1,
      immutableMinTimeToLive: 24 * 3600 * 1000, // 24h
      ignoreCargoCult: true,
    }
  }

  const storageAdapter = new QuickLRU({ maxSize: 1000 })

  gotOptions.handlers = [
    (options, next) => {
      gotOptions.cache = storageAdapter
      return next(options)
    },
  ]

  const gotInstance = got.extend(gotOptions)

  return { got: gotInstance }
})()
