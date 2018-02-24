
const getFlight = require('../api/cz.js')

exports.postFlight = async ctx => {
  const user = ctx.request.body
  const res = await getFlight(user)
  ctx.body = res
}
