import { MongoClient, type Db } from "mongodb"

const getUri = () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }
  return uri
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

const initializeConnection = () => {
  if (clientPromise) return clientPromise

  const uri = getUri()

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export async function getDb(): Promise<Db> {
  try {
    const clientPromise = initializeConnection()
    const client = await clientPromise
    return client.db()
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    throw error
  }
}

export default () => initializeConnection()
