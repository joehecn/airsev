
const getFlight = require('../../../src/app/api/zh.js')

describe.skip('/test/app/api/zh.test.js', () => {
  describe('getFlight', () => {
    it('should ok 1', () => {
      return getFlight({ name: '张展红', card: '442527196803300882' }).then(res => {
        console.log(res.status)
        expect(res.name).toBe('张展红')
      })
    })

    it.skip('should ok 2', async () => {
      const res = await getFlight({ name: '张展红', card: '441424199209086763' })
      console.log(res.status)
      expect(res.name).toBe('张展红')
    })
  })
})
