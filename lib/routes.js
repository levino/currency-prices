import Price from './schemas'
import './mongoose'
import util from 'util'
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

const saveToCache = (prices) => {
  const price = new Price(prices)
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

export const euro = (req, res) => {
  req.checkQuery('date', 'Date must exist').notEmpty().isNiceDate()
  console.log(req.query)
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).send('There have been validation errors: ' + util.inspect(result.array()))
    }
    const roundedDate = moment(req.query.date).startOf('day').add(1, 'days')
    fromCache(roundedDate).then((result) => {
      return res.status(200).send(result)
    }).catch(err => {
      if (err.message !== 'Not found in cache.') {
        throw err
      }
      return fromApi(roundedDate).then(saveToCache).then(result => {
        return res.status(200).send(result)
      })
    }).catch(err => {
      console.error(err)
      return res.status(500).end()
    })
  })
}
