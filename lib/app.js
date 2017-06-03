import express from 'express'
import { euro } from './routes'
import bodyParser from 'body-parser'
import validator from 'express-validator'
import { checkDate } from './tools'

const app = express()
app.use(bodyParser.json())
app.use(validator({
  customValidators: {
    isNiceDate: checkDate
  }
}))
app.get('/prices/v1/EUR', euro)

export default app
