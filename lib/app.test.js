import { resetDb } from './testTools/mongo'
import request from 'supertest'
import app from './app'

suite('Integration tests', function() {
  teardown(function() {
    return resetDb()
  })
  test('should pass for a good request', function() {
    return request(app).get('/exchangerates/EUR').query({
      date: '2017-04-12T12:21:40.403Z'
    }).expect(200)
  })
  test('should fail for a request with a bad date', function() {
    return request(app).get('/exchangerates/EUR').query({
      date: Date.now()
    }).expect(400)
  })
})
