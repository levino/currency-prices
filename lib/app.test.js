import { resetDb } from './testTools/mongo'
import request from 'supertest'
import app from './app'

const queryApp = () => {
  return request(app).get('/prices/v1/EUR').type('json')
}

suite('Integration tests', function() {
  teardown(function() {
    return resetDb()
  })
  test('should pass for a good request', function() {
    return queryApp().query({
      date: '2017-04-12T12:21:40.403Z'
    }).expect(200).then(response => {
      console.log(response.body)
      return response.body
    })
  })
  test('should fail for a request with a bad date', function() {
    return queryApp().query({
      date: Date.now()
    }).expect(400)
  })
  suite('Cache tests', function() {
    setup(function() {
      return queryApp().query({
        date: '2017-04-12T12:21:40.403Z'
      })
    })
  })
})
