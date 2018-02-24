
const fs = require('fs')
const { formatDateTime } = require('./tool.js')

const _logPath = require('../../logpath.js')() + '/log/'

module.exports = (fileName, appid, token) => {
  const file = fs.createWriteStream(`${_logPath}${fileName}.log`, { flags: 'a' })
  const date = formatDateTime(new Date(), true)
  file.write(`${appid} ${token} ${date}\n`)
}
