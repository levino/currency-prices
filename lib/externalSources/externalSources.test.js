import {XBTinUSD, XBTinEUR, USDinEUR } from './index'
import moment from 'moment'
import '../testTools/promisedChai'
suite('Test external sources', function () {
  test('should get the correct price of one Bitcoin in Euro', function () {
    return XBTinEUR(moment('2013-09-01')).should.become(
      {
        price: 97.0904,
        currency: 'XBT',
        source: 'bpi'
      }
    )
  })
  test('should get the correct price of one Bitcoin in USD', function () {
    return XBTinUSD(moment('2013-09-01')).should.become(
      {
        price: 128.2597,
        currency: 'XBT',
        source: 'bpi'
      })
  })
  test('should get the correct price of one USD in EUR', function () {
    return USDinEUR(moment('2013-09-01')).should.become(
      {
        price: 0.7555723460521345,
        currency: 'USD',
        source: 'fixer.io'
      })
  })
})
