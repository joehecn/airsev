
const Router = require('koa-router')
const { internalServerError } = require('../util/err.js')
const log = require('../util/log.js')
const { postFlight } = require('../controller/mu.js')

const mu = module.exports = new Router()

mu.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(err)
    const message = err.message || internalServerError
    const status = err.status || 500
    log('muErr', '', message)

    ctx.status = status
    ctx.body = message // '服务器内部错误'
  }
})

mu.post('/flight', postFlight)
