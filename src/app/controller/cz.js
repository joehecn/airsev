
const getFlight = require('../api/cz.js')

exports.postFlight = async ctx => {
  // console.log(ctx.request.body)
  const user = ctx.request.body
  const res = await getFlight(user)
  ctx.body = res
}
