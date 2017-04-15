import Price from './schemas'
import './mongoose'
import util from 'util'
import {pick} from 'lodash'
import moment from 'moment'
import {
  getAllEuroPrices
} from './externalSources'
const fromCache = (date) => {
  return Price.findOne({}).where('date').equals(date.toISOString()).then(result => {
    if (!result) {
      throw new Error('Not found in cache.')
    }
    return result
  })
}

const saveToCache = (priceData) => {
  const price = new Price(priceData)
  return price.save()
}

const fromApi = (date) => {
  return getAllEuroPrices(date).then(prices => {
    return {
      date: date.toISOString(),
      baseCurrency: 'EUR',
      prices
    }
  })
}

const mongoResultToResponse = (mongooseResult) => {
  const data = pick(mongooseResult, [ 'date', 'baseCurrency' ])
  const prices = mongooseResult.prices.map(price => {
    return pick(price, [ 'currency', 'price', 'source' ])
  }).reduce((acc, price) => {
    return {
      ...acc,
      [price.currency]: {
        price: price.price,
        source: price.source
      }
    }
  }, {})
  return {
    ...data,
    prices
  }
}

export const euro = (req, res) => {
  req.checkQuery('date', 'Date must exist').notEmpty().isNiceDate()
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).send('There have been validation errors: ' + util.inspect(result.array()))
    }
    const roundedDate = moment(req.query.date).utc().startOf('day').add(1, 'days')
    fromCache(roundedDate).then((result) => {
      return res.status(200).send({
        ...mongoResultToResponse(result),
        fromCache: true
      })
    }).catch(err => {
      if (err.message !== 'Not found in cache.') {
        throw err
      }
      return fromApi(roundedDate).then(saveToCache).then(result => {
        return res.status(200).send(mongoResultToResponse(result))
      })
    }).catch(err => {
      console.error(err)
      return res.status(500).end()
    })
  })
}
