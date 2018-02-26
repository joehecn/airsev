
const baseRpn = require('request-promise-native')
const parseString = require('xml2js').parseString

const baseHost = 'csair.com'
const preB2c = 'b2c'
const preExtra = 'extra'

const getHost = pre => {
  return `${pre}.${baseHost}`
}

const b2cOrigin = `http://${getHost(preB2c)}`
const extraOrigin = `http://${getHost(preExtra)}`

const getBaseHeaders = () => {
  return {
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
  }
}

const getLoginOptions = () => {
  const headers = getBaseHeaders()
  headers['Accept'] = 'application/json, text/javascript, */*; q=0.01'
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  headers['Host'] = getHost(preB2c)
  headers['Origin'] = b2cOrigin
  headers['X-Requested-With'] = 'XMLHttpRequest'

  return {
    uri: `${b2cOrigin}/portal/user/login`,
    method: 'POST',
    headers,
    form: {
      userId: 13528706248,
      passWord: 201314,
      loginType: 1,
      memberType: 1
    },
    json: true
  }
}

const getExtraJsonOptions = uriPart => {
  const headers = getBaseHeaders()
  headers['Accept'] = 'application/json, text/javascript, */*; q=0.01'
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  headers['Host'] = getHost(preExtra)
  headers['Origin'] = extraOrigin
  headers['X-Requested-With'] = 'XMLHttpRequest'

  return {
    uri: `${extraOrigin}${uriPart}`,
    method: 'POST',
    headers,
    form: {
      language: 'zh'
    },
    json: true
  }
}

const getCheckSeatNewLoginOptions = user => {
  const headers = getBaseHeaders()
  headers['Accept'] = 'application/xml, text/xml, */*; q=0.01'
  headers['Content-Type'] = 'text/xml'
  headers['Host'] = getHost(preExtra)
  headers['Origin'] = extraOrigin

  const name = user.name.substr(0, 1) + '###' + user.name.substr(1)

  return {
    uri: `${extraOrigin}/B2C40/data/services/seatnew/checkSeatNewLogin.xsql`,
    method: 'POST',
    headers,
    body: `<?xml version="1.0" encoding="utf-8"?><page><RETRIEVEBY>IDFN</RETRIEVEBY>undefined<IDFN><ID>${user.card}</ID><NAME>${name}</NAME></IDFN><INFO></INFO></page>`
  }
}

const checkPassed = res => {
  return new Promise(resolve => {
    parseString(res, {
      explicitArray: false
    }, function (err, result) {
      // console.log(result)
      let isPassed = false
      let status = ''

      if (err) {
        status = err.message || '未知4-1'
      } else if (result &&
        result.page &&
        result.page.page) {
        if (result.page.page.CHECKPASSED &&
          result.page.page.CHECKPASSED === 'Y') {
          isPassed = true
        } else if (result.page.page.ERRORMSG) {
          status = result.page.page.ERRORMSG
        } else {
          status = '未知4-2'
        }
      } else {
        status = '未知4-3'
      }

      resolve({ isPassed, status })
    })
  })
}

module.exports = async user => {
  const jar = baseRpn.jar()
  const rpn = baseRpn.defaults({ jar })

  try {
    // login
    const loginOptions = getLoginOptions()
    let res = await rpn(loginOptions)
    // console.log(res)
    user.success1 = res.success
    if (res.success) {
      // console.log(jar.getCookieString(extraOrigin))
      // cs1246643sso=b264cab7abc34894b8966e3dae596601; memberType=1; loginType=4; userId=413528706248; userType4logCookie=M; userId4logCookie=413528706248; useridCookie=%E6%B1%AA%E5%87%8C%E4%BA%91; userCodeCookie=%E6%B1%AA%E5%87%8C%E4%BA%91
      // checkB2CLogin
      const checkB2CLoginOptions = getExtraJsonOptions('/B2C40/seatnew/jaxb/b2clogin/checkB2CLogin.ao')
      res = await rpn(checkB2CLoginOptions)
      user.message2 = res.message
      if (res.message === 'success') {
        // console.log(jar.getCookieString(extraOrigin))
        // cs1246643sso=b264cab7abc34894b8966e3dae596601; memberType=1; loginType=4; userId=413528706248; userType4logCookie=M; userId4logCookie=413528706248; useridCookie=%E6%B1%AA%E5%87%8C%E4%BA%91; userCodeCookie=%E6%B1%AA%E5%87%8C%E4%BA%91; JSESSIONID=E93082C47B273264A21A1A0ED5DB58FF
        // checkSeatNewLogin
        const checkSeatNewLoginOptions = getCheckSeatNewLoginOptions(user)
        res = await rpn(checkSeatNewLoginOptions)
        const isPassedObj = await checkPassed(res) // boolean
        user.isPassedObj3 = isPassedObj
        if (isPassedObj.isPassed) {
          // console.log(jar.getCookieString(extraOrigin))
          // queryFlight
          let queryFlightOptions = getExtraJsonOptions('/B2C40/seatnew/jaxb/flights/queryFlight.ao')
          res = await rpn(queryFlightOptions)
          if (res.FLIGHT && res.FLIGHT.length > 0) {
            const flights = res.FLIGHT

            let flightArr = []
            for (let i = 0, len = flights.length; i < len; i++) {
              let flight = flights[i]
              // flightArr.push(`日期: ${flight.FLIGHTDATE} 航班: ${flight.CARRIER}${flight.FLIGHTNO} 票号: ${flight.TICKETNUM}`)
              flightArr.push({
                date: flight.FLIGHTDATE,
                flightNum: `${flight.CARRIER}${flight.FLIGHTNO}`,
                ticket: flight.TICKETNUM
              })
            }
            // user.status = statusArr.join(', ')
            user.status = { flights: flightArr }
            return user
          } else {
            user.status = { message: '未知5' }
            return user
          }
        } else {
          user.status = { message: isPassedObj.status }
          return user
        }
      } else {
        user.status = { message: '未知3' }
        return user
      }
    } else {
      user.status = { message: '未知2' }
      return user
    }
  } catch (error) {
    console.log('------- error:')
    console.log(error)
    user.status = { message: error.message || '未知1' }
    console.log(user)
    return user
  }
}

// getFlight({
//   name: '温思娜',
//   card: '441424199209086762'
// }).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })
