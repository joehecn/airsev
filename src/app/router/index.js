
const Router = require('koa-router')
const zh = require('./zh.js') // 深航
const mu = require('./mu.js') // 东航
const cz = require('./cz.js') // 南航

const router = module.exports = new Router()

// 网站根目录
router.get('/', ctx => {
  ctx.body = 'air sev look\'s good'
})

// 子路由
router.use('/api/zh', zh.routes())
router.use('/api/mu', mu.routes())
router.use('/api/cz', cz.routes())
