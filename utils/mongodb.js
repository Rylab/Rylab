import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  )
}

if (!process.env.MONGODB) {
  throw new Error(
    'Please define the MONGODB environment variable inside .env'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cached.promise = MongoClient.connect(process.env.MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(process.env.MONGODB),
      }
    })
  }
  cached.conn = await cached.promise

  return cached.conn
}

export const dbCollection = async (collection) => {
  try {
    const { db } = await dbConnect()

    return {
      [`${collection}Collection`]: db.collection(collection),
    }
  } catch (error) {
    console.error(error)
  }
}
