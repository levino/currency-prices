if (!process.env.MONGO_URL) {
  throw new Error('Need to set MONGO_URL for caching')
}

export const mongoUrl = process.env.MONGO_URL

const config = {
  mongoUrl
}

export default config