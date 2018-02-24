
const getFlight = require('../../../src/app/api/mu.js')

describe.skip('/test/app/api/mu.test.js', () => {
  describe('getFlight', () => {
    it('should ok 1', async () => {
      const res = await getFlight({ name: '唐红娣', card: '440226196908242469' })
      console.log(res.status)
      expect(res.name).toBe('唐红娣')
    })

    it('should ok 2', async () => {
      const res = await getFlight({ name: '唐红娣', card: '441424199209086763' })
      console.log(res.status)
      expect(res.name).toBe('唐红娣')
    })
  })
})
