
const Koa = require('koa')
const cors = require('kcors')
// const xmlParser = require('koa-xml-body')
const bodyParser = require('koa-bodyparser')
const router = require('./router')

const koa = module.exports = new Koa()

koa
  .use(cors())
  // .use(xmlParser({
  //   xmlOptions: {
  //     explicitArray: false
  //   }
  // }))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
