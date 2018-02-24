
const getFlight = require('../api/zh.js')

exports.postFlight = async ctx => {
  const user = ctx.request.body
  const res = await getFlight(user)
  ctx.body = res
}
