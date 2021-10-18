module.exports = function (debug = false) {
  const logger = debug ? defaultLogger() : false

  return {
    logger,
    requestProcessed(data) {
      if (!this.logger) return false
      try {
        const [to, from] = parseURLs(data)

        delete data.headers['host']

        return this.logger.log(data, {
          meta: {
            to: to?.hostname,
            from: from?.hostname || 'browser',
          },
        })
      } catch (e) {
        return e
      }
    },
  }
}

function parseURLs(data) {
  try {
    const to = data.status.url && new URL(data.status.url)
    const from = data.headers['origin'] && new URL(data.headers['origin'])

    return [to, from]
  } catch (_) {
    return [data.status.url, data.headers['origin']]
  }
}

function defaultLogger() {
  const logger = {
    log: (...args) => {
      console.debug(...args)
      return true
    },
    warn: (...args) => {
      console.warn(...args)
      return true
    },
  }

  function onSignal(signal) {
    logger.warn(`received signal ${signal}, shutting down`)
    shutdown()
  }

  async function shutdown() {
    process.exit(0)
  }

  process.on('SIGTERM', onSignal)
  process.on('SIGINT', onSignal)

  return logger
}
