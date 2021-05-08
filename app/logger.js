const { once } = require('events')
const { createLogger } = require('@logdna/logger')

module.exports = (function () {
  const logger = process.env.ENABLE_LOGDNA === '1' ? getLogDNA() : false

  return {
    requestProcessed(data) {
      if (!logger) return
      const to = data.status.url && new URL(data.status.url)
      const from = data.headers['origin'] && new URL(data.headers['origin'])

      delete data.headers['host']

      logger.log(data, {
        meta: {
          to: to?.hostname,
          from: from?.hostname || 'browser',
        },
      })
    },
  }
})()

function getLogDNA() {
  const logger = createLogger(process.env.LOGDNA_KEY, {
    app: 'allOrigins',
    indexMeta: true,
  })

  logger.on('error', console.error)

  function onSignal(signal) {
    logger.warn('received signal, shutting down')
    shutdown()
  }

  async function shutdown() {
    await once(logger, 'cleared')
    process.exit(0)
  }

  process.on('SIGTERM', onSignal)
  process.on('SIGINT', onSignal)

  return logger
}
