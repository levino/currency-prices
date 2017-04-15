import {resetDb} from './testTools/mongo'
import request from 'supertest'
import app from './app'

const queryApp = () => {
  return request(app).get('/prices/v1/EUR').type('json')
}

suite('Integration tests', function () {
  teardown(function () {
    return resetDb()
  })
  test('should pass for a good request', function () {
    return queryApp().query({
      date: '2017-04-12T12:21:40.403Z'
    }).expect(200).then(response => {
      response.body.should.not.have.any.keys('fromCache')
      return response.body
    })
  })
  test('should fail for a request with a bad date', function () {
    return queryApp().query({
      date: Date.now()
    }).expect(400)
  })
  suite('Cache tests', function () {
    let firstQuery
    setup(function () {
      return queryApp().query({
        date: '2017-04-12T12:21:40.403Z'
      }).then(response => {
        firstQuery = response.body
      })
    })
    test('should get data from the cache', function () {

      const expectedResult = {
        date: '2017-04-13T00:00:00.000Z',
        baseCurrency: 'EUR',
        prices: {
          XBT: { price: 1110.1215, source: 'bpi' },
          USD: { price: 0.9407337723424272, source: 'fixer.io' },
          EUR: { price: 1, source: 'logic' }
        },
        fromCache: true
      }

      return queryApp().query({
        date: '2017-04-12T12:21:40.403Z'
      }).then(response => {
        response.body.should.deep.equal(expectedResult)
      })
    })
  })
})
