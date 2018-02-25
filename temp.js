
const getFlight = require('./src/app/api/cz.js')

getFlight({
  name: '陈宇',
  card: '231026199306190010'
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})