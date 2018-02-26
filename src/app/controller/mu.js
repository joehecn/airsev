
const getFlight = require('../api/mu.js')

const checkBreakMessage = message => {
  if (message && (message === '307 - undefined' || message.indexOf('EAI_AGAIN') > -1)) {
    return false
  }
  return true
}

exports.postFlight = async ctx => {
  const user = ctx.request.body
  let res

  let i = 0
  while (i < 3) {
    console.log('------' + i)
    res = await getFlight(user)
    if (checkBreakMessage(res.status.message)) {
      break
    }
    i++
  }
  ctx.body = res
}
