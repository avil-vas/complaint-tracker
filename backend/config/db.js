import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGODB_URI is not configured")
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    }).then(() => {
      console.log("MongoDB connected")
      return mongoose.connection
    }).catch((error) => {
      connectionPromise = undefined
      throw error
    })
  }

  return connectionPromise
}

export default connectDB