import "dotenv/config";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

const keepAlive = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log(`[${new Date().toISOString()}] Mongo pinged successfully!`);
    await mongoose.connection.close();
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error pinging Mongo:`, err);
  }
};

// Run the arrow function
keepAlive();
