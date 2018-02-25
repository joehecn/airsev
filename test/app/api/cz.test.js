
const getFlight = require('../../../src/app/api/cz.js')

describe.skip('/test/app/api/cz.test.js', () => {
  describe('getFlight', () => {
    it('should ok 1', async () => {
      const res = await getFlight({ name: '温思娜', card: '441424199209086762' })
      console.log(res)
      expect(res.name).toBe('温思娜')
    })

    it.skip('should ok 2', async () => {
      const res = await getFlight({ name: '温思娜', card: '441424199209086763' })
      console.log(res)
      expect(res.name).toBe('温思娜')
    })
  })
})
