
const supertest = require('supertest')
const server = require('../../../src/app')

describe.skip('/test/app/router/index.test.js', () => {
  describe('GET /', () => {
    it('should 200', done => {
      return supertest(server.listen())
        .get('/')
        .expect(200)
        .expect('air sev look\'s good', done)
    })
  })
})
