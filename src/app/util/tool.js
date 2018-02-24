
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

exports.formatDateTime = (date, coverTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dateStr = [year, month, day].map(formatNumber).join('-')

  if (coverTime) {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return dateStr + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }

  return dateStr
}
