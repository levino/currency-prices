import { mongoUrl } from './config'
import mongoose from 'mongoose'
import Promise from 'bluebird'
mongoose.Promise = Promise
if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoUrl)
}
