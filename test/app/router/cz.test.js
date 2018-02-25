const supertest = require('supertest')
// const assert = require('assert')
const server = require('../../../src/app')

describe.skip('/test/app/router/cz.test.js', () => {
  describe('POST /api/cz/flight', () => {
    it('should 200', () => {
      return supertest(server.listen())
        .post('/api/cz/flight')
        .send({ name: '温思娜', card: '441424199209086762' })
        .expect(200)
        // .end((err, res) => {
        //   if (err) return done(err)
        //   console.log(res.body)
        //   done()
        // })
        .then(response => {
          console.log(response.body)
          // assert(response.body.name, '温思娜')
          expect(response.body.name).toBe('温思娜')
        })
    })

    it.skip('should 200', () => {
      return supertest(server.listen())
        .post('/api/cz/flight')
        .send({ name: '温思娜', card: '441424199209086763' })
        .expect(200)
        // .end((err, res) => {
        //   if (err) return done(err)
        //   console.log(res.body)
        //   done()
        // })
        .then(response => {
          console.log(response.body.status)
          expect(response.body.name).toBe('温思娜')
        })
    })
  })
})
