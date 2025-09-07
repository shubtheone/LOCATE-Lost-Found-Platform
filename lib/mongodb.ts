import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.yitdtls.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGO_DB_USER || !process.env.MONGO_DB_PASSWORD || !process.env.MONGO_DB_DATABASE) {
  throw new Error("Missing MongoDB environment variables");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;

// Add this function export:
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB_DATABASE);
  return { client, db };
}