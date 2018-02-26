
// 深航
const rpn = require('request-promise-native')

const host = 'm.shenzhenair.com'
const origin = `http://${host}`

const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

let options = {
  uri: `${origin}/weixin_front/checkin.do?method=queryTrip`,
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': host,
    'Origin': origin,
    'Referer': `${origin}/szair_B2C/checkIn/initCheckIn.action`,
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Mobile Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  },
  json: true
}

/**
 * http://m.shenzhenair.com/webresource-micro/jsp/js/checkin/checkIn.js
 * http://m.shenzhenair.com/webresource-micro/jsp/js/szwxJsCommon.js
 *
 * 校验身份证
 *
 * @param idCard
 *            身份证号
 */
const checkIdCard = idCard => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  if (reg.test(idCard)) {
    return 'NI'
  }
  return 'TN'
}

module.exports = async user => {
  try {
    let certType = checkIdCard(user.card)
    // console.log(certType)

    options.form = {
      'NAME': user.name,
      'CERTTYPE': certType,
      'CERTNO': user.card,
      'MOBILE': '13528706248'
    }

    const res = await rpn(options)
    // console.log(res)
    const flights = res.FLIGHT || []

    if (flights.length === 0) {
      user.status = { message: res.MESSAGE }
    } else {
      let flightArr = []
      for (let i = 0, len = flights.length; i < len; i++) {
        let flight = flights[i]
        // statusArr.push(`${flight.FLIGHTDATE}: ${flight.PASSANGERSTATUS}(票号: ${flight.TKTNUM})`)
        // statusArr.push(`${flight.FLIGHTDATE} 票号: ${flight.TKTNUM}`)

        flightArr.push({
          date: flight.FLIGHTDATE,
          flightNum: flight.FLIGHTNO,
          ticket: flight.TKTNUM
        })
      }

      user.status = { flights: flightArr }
    }
    return user
  } catch (error) {
    console.log('------- error:')
    console.log(error)
    user.status = { message: '未知1' }
    return user
  }
}

// module.exports = datas => {
//   return new Promise(resolve => {
//     let count = 0
//     const len = datas.length

//     for (let i = 0; i < len; i++) {
//       (function(i){
//         let data = datas[i]

//         let certType = 'TN'
//         if (checkIdCard(data.card)) {
//           certType = 'NI'
//         }

//         options.form = {
//           'NAME': data.name,
//           'CERTTYPE': certType,
//           'CERTNO': data.card,
//           'MOBILE': '18124352828'
//         }

//         rpn(options).then(res => {
//           let flights = res.FLIGHT || []

//           if (flights.length === 0) {
//             // {"FLIGHT":[],"MESSAGE":"没有查询到可以办理的行程，如有疑问请咨询在线客服或拨打95361-3","OPRESULT":"3"}
//             datas[i].status = res.MESSAGE
//           } else {
//             let statusArr = []
//             for (let i = 0, len = flights.length; i < len; i++) {
//               let flight = flights[i]
//               // statusArr.push(`${flight.FLIGHTDATE}: ${flight.PASSANGERSTATUS}(票号: ${flight.TKTNUM})`)
//               statusArr.push(`${flight.FLIGHTDATE} 票号: ${flight.TKTNUM}`)
//             }
//             datas[i].status = statusArr.join(', ')
//           }

//           count++
//           if (count === len) {
//             resolve(datas)
//           }
//         }).catch(error => {
//           console.log('-------- ' + i)
//           console.log(error)
//           datas[i].status = 'system error'

//           count++
//           if (count === len) {
//             resolve(datas)
//           }
//         })
//       })(i)
//     }
//   })
// }

// {"FLIGHT":[{"AIRLINECODE":"ZH","ARRIVEDATE":"2018-02-25","ARRIVETIME":"18:10","CARDNO":"","CARDTYPE":"","CARRAIRLINECODE":"","CERTNO":"35210219791211242X","CERTTYPE":"NI","CLASSCODE":"K","CLASSLEVEL":"Y","DEPNAME":"宝安机场T3","DSTNAME":"丽江三义机场","FLIGHTDATE":"2018-02-25","FLIGHTNO":"ZH9435","FLIGHTNUMBER":"9435","FLIGHTTIME":"15:10","FROMCITY":"SZX","FROMCITYNAME":"深圳","ISCHILD":"false","ISINIT":"false","ISMAIN":"false","ISSELECTSEAT":"false","PASSANGERSTATUS":"未预选座位","PASSENGERNAME":"林兰英","PNR":"","SEATNO":"","STATUS":"OPEN FOR USE","TICKETAMOUNT":"620.0","TKTNUM":"4792126998182","TOCITY":"LJG","TOCITYNAME":"丽江","TOURINDEX":""},{"AIRLINECODE":"ZH","ARRIVEDATE":"2018-03-01","ARRIVETIME":"14:10","CARDNO":"","CARDTYPE":"","CARRAIRLINECODE":"","CERTNO":"35210219791211242X","CERTTYPE":"NI","CLASSCODE":"M","CLASSLEVEL":"Y","DEPNAME":"丽江三义机场","DSTNAME":"宝安机场T3","FLIGHTDATE":"2018-03-01","FLIGHTNO":"ZH9942","FLIGHTNUMBER":"9942","FLIGHTTIME":"11:40","FROMCITY":"LJG","FROMCITYNAME":"丽江","ISCHILD":"false","ISINIT":"false","ISMAIN":"false","ISSELECTSEAT":"false","PASSANGERSTATUS":"未预选座位","PASSENGERNAME":"林兰英","PNR":"","SEATNO":"","STATUS":"OPEN FOR USE","TICKETAMOUNT":"1840.0","TKTNUM":"4792126998191","TOCITY":"SZX","TOCITYNAME":"深圳","TOURINDEX":""}],"MESSAGE":"","OPRESULT":"0"}
