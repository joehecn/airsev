
const rpn = require('request-promise-native')

const host = 'ecki.ceair.com'
const origin = `http://${host}`

const m = [/^\d{15}(\d{2}[\dXx])?$/, /^\w{3,12}$/, /^\d{3}-?\d{10}$/, /^[a-zA-Z]{3}\d{12}$/]
const p = ['NI', 'PP', 'TN', 'NI']

let options = {
  uri: `${origin}/WebCheckin/uniEnter/query.shtml`,
  method: 'POST',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': host,
    'Origin': origin,
    'Referer': `${origin}/server/cuss.html`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
  }
}

// http://www.ceair.com/resource/js/cuss/index.js
const checkIdCard = idCard => {
  let a = ''
  for (let e = 0; e < m.length; e++) {
    if (m[e].test(idCard)) {
      a = p[e]
      break
    }
  }
  return a || !1
}

module.exports = async user => {
  try {
    let certType = checkIdCard(user.card)

    options.form = {
      'certNo': user.card,
      'certType': certType,
      'certName': user.name
    }

    const res = await rpn(options)
    const arr = res.split('var segList = eval(\'')

    if (arr.length === 1) {
      user.status = { message: '未提取到您2天内订妥座位的东航行程' }
    } else {
      const flights = JSON.parse(arr[1].split('\');')[0])

      let flightArr = []
      for (let i = 0, len = flights.length; i < len; i++) {
        let flight = flights[i]
        let flightDate = flight.depDateTime.substr(0, 10)
        // let flightStatus = getFlightStatus(flight.type || 0)

        // statusArr.push(`${flightDate}: ${flightStatus}(票号: ${flight.tktNo})`) flightNo
        // statusArr.push(`${flightDate} 票号: ${flight.tktNo}`)

        flightArr.push({
          date: flightDate,
          flightNum: flight.flightNo,
          ticket: flight.tktNo
        })
      }

      user.status = { flights: flightArr }
    }
    return user
  } catch (error) {
    console.log('------- error:')
    console.log(error)
    user.status = { message: error.message || '未知1' }
    return user
  }
}

// http://ecki.ceair.com/WebCheckin/uniEnter/query.shtml
// function getFlightStatus (type) {
//   switch (type) {
//     case 1:
//     case 4:
//     case 5:
//       return '未办理'
//     case 2:
//       return '已办理'
//     case 3:
//       return '不能办理'
//   }

//   return '待定'
// }

// module.exports = datas => {
//   return new Promise(resolve => {
//     let count = 0
//     const len = datas.length

//     for (let i = 0; i < len; i++) {
//       (function (i) {
//         let data = datas[i]

//         let certType = checkIdCard(data.card)

//         options.form = {
//           'certNo': data.card,
//           'certType': certType,
//           'certName': data.name
//         }

//         rpn(options).then(res => {
//           // const $scripts = $('head').find('script')

//           // const $flightList = $('.flight_list').find('table')
//           // if ($flightList.length === 0) {
//           //   datas[i].status = '未提取到您2天内订妥座位的东航行程'
//           // } else {
//           //   let statusArr = []
//           //   for (let i = 0, len = $flightList.length; i < len; i++) {
//           //     let $flight = $flightList.eq(i)
//           //     // console.log($flight.text())
//           //     let flightDate = $flight.find('tbody td').eq(0).text().replace('航班日期：', '')
//           //     let $theadtds = $flight.find('thead td')
//           //     let flightStatus = $theadtds.eq(2)
//           //     let flightTktNum = $theadtds.eq(1).text()

//           //     statusArr.push(`${flightDate}: ${flightStatus}(票号: ${flightTktNum})`)
//           //   }
//           //   datas[i].status = statusArr.join(', ')
//           // }

//           const arr = res.split('var segList = eval(\'')
//           if (arr.length === 1) {
//             datas[i].status = '未提取到您2天内订妥座位的东航行程'
//           } else {
//             const flights = JSON.parse(arr[1].split('\');')[0])

//             let statusArr = []
//             for (let i = 0, len = flights.length; i < len; i++) {
//               let flight = flights[i]
//               let flightDate = flight.depDateTime.substr(0, 10)
//               // let flightStatus = getFlightStatus(flight.type || 0)

//               // statusArr.push(`${flightDate}: ${flightStatus}(票号: ${flight.tktNo})`)
//               statusArr.push(`${flightDate} 票号: ${flight.tktNo}`)
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

// [ { status: '客票已使用，请联系售票点或使用其他客票。(P103_5)',
//     departure: 'SZX',
//     arrival: 'KMG',
//     depEn: 'SHENZHEN',
//     arrEn: 'KUNMING',
//     depCityName: '深圳',
//     arrCityName: '昆明',
//     tktNo: '7812431890358',
//     flightNo: 'MU5758',
//     cabin: 'V',
//     depDateTime: '2018-02-22 16:50',
//     type: 2,
//     cancelAction: 0,
//     printAction: 1,
//     checkinAction: 0,
//     seatAction: 0,
//     canAsr: 0,
//     depDate: '2018-02-22',
//     depTime: '16:50',
//     isStop: 0,
//     isToAF: 0,
//     isToDL: 0,
//     mkt: 'CN',
//     carrAirlineCode: '',
//     carrFlightNumber: 'MU5758' } ]

// let certNo = 'H60286267'
// let certType = checkIdCard(certNo)

// options.form = {
//   'certNo': certNo,
//   'certType': certType,
//   'certName': '徐瑞敏'
// }

// rpn(options).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log('------ error')
//   console.log(error)
// })
