import randomstring from 'randomstring'
process.env.MONGO_URL = `mongodb://localhost/${randomstring.generate(7)}`
import mongoose from 'mongoose'
export const resetDb = () => {
  return mongoose.connection.db.dropDatabase()
}
