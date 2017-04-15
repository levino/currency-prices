if (!process.env.MONGO_URL) {
  throw new Error('Need to set MONGO_URL for caching')
}

export const mongoUrl = process.env.MONGO_URL
export const port = process.env.PORT ? Number(process.env.PORT) : 3000

const config = {
  mongoUrl
}

export default config