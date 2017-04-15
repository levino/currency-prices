import mongoose, { Schema } from 'mongoose'
import { isEqual } from 'lodash'
const supportedCurrencies = [ 'USD', 'EUR', 'XBT' ]

const validator = prices => {
  const currencies = prices.map(price => {
    return price.currency
  })
  return isEqual(supportedCurrencies.sort(), currencies.sort())
}

const subERSchema = Schema({
  currency: String,
  price: Number
})

const priceSchema = Schema({
  date: { type: Date, index: true },
  baseCurrency: {
    type: String,
    enum: ['EUR', 'USD'],
    required: true,
    index: true
  },
  prices: {
    type: [subERSchema],
    required: true,
    validate: {
      validator,
      message: '{VALUE} is not a valid prices array. Maybe missing an asset?!'
    }
  }
})

let Price

if (mongoose.models.Price) {
  Price = mongoose.model('Price')
} else {
  Price = mongoose.model('Price', priceSchema)
}

export default Price
