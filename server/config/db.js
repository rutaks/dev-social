import mongoose from "mongoose";
import env from "custom-env";

env.env();
const env = process.env.NODE_ENV;
const db = env === "testing" ? process.env.TEST_DB : process.env.PRODUCTION_DB;

/* istanbul ignore next */
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    throw err;
  }
};

export default connectDB;
