import { checkDate } from './index'
import chai from 'chai'
chai.should()
suite('Tool tests', function () {
  test('A correct date should pass the check', function() {
    checkDate('2013-02-04T22:44:30.652Z').should.be.true
  })
  test('An incorrect date should not pass the check', function() {
    checkDate(Date.now()).should.be.false
  })
})