import ExchangeRates from './index.js'
import chai from 'chai'
const should = chai.should()

suite('Schema tests', function () {
  test('A correct exchange rate object should pass the validation', function () {
    const exchangeRate = new ExchangeRates({
      date: Date.now(),
      baseCurrency: 'EUR',
      prices: [
        {
          currency: 'XBT',
          price: 1000
        },
        {
          currency: 'EUR',
          price: 1
        },
        {
          currency: 'USD',
          price: 0.9
        }
      ]
    })
    should.not.exist(exchangeRate.validateSync())
  })
  test('An incomplete exchange rate object should not pass the validation', function () {
    const exchangeRate = new ExchangeRates({
      date: Date.now(),
      prices: [
        {
          currency: 'XBT',
          value: '0.001'
        }
      ]
    })
    should.exist(exchangeRate.validateSync())
  })
})
