import { Db, MongoClient, Collection, Document } from 'mongodb'

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

declare global {
  var mongo: { client: MongoClient | null; db: Db | null } | undefined;
}

let cached = global.mongo

if (!cached) {
  cached = global.mongo = { client: null, db: null }
}

async function dbConnect() {
  if (cached?.client && cached?.db) {
    return cached
  }

  const opts = {
    connectTimeoutMS: 10000, // 10s
    socketTimeoutMS: 20000,
  }

  const client = new MongoClient(process.env.MONGODB_URI ?? '', opts)
  const db = await client.db(process.env.MONGODB ?? '')

  cached = { client, db }

  return cached
}

export const dbCollection = async <T extends Document = Document>(collection: string): Promise<Collection<T>> => {
  const { db } = await dbConnect()

  if (!db) {
    throw new Error('No database connection')
  }

  return db.collection(collection)
}
