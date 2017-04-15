import Coindesk from 'coindesk-api'
const coindesk = new Coindesk()
import Promise from 'bluebird'
import fixer from 'fixer-api'

const bpi = (date, toCurrency) => {
  return new Promise((resolve, reject) => {
    coindesk.getPricesForSingleCurrency(date.format('YYYY-MM-DD'), date.format('YYYY-MM-DD'), toCurrency, (err, result) => {
      if (err) {
        return reject(err)
      }
      const {
        rate
      } = result[ 0 ]
      return resolve({
        price: rate,
        source: 'bpi',
        currency: 'XBT'
      })
    })
  })
}

export const XBTinEUR = (date) => {
  return bpi(date, 'EUR')
}

export const XBTinUSD = (date) => {
  return bpi(date, 'USD')
}

export const USDinEUR = (date) => {
  return fixer.forDate(date.format('YYYY-MM-DD'), { base: 'EUR', symbols: [ 'USD' ] }).then(data => {
    const {
      rates
    } = data
    return {
      currency: 'USD',
      price: Number(1 / rates['USD']),
      source: 'fixer.io'
    }
  })
}

export const getAllEuroPrices = (date) => {
  return Promise.all([
    XBTinEUR(date),
    USDinEUR(date)
  ]).then(rates => {
    return rates.concat({
      currency: 'EUR',
      price: 1,
      source: 'logic'
    })
  })
}
