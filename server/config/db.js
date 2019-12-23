import mongoose from "mongoose";
import env from "custom-env";

env.env();
const environment = process.env.NODE_ENV;
/* istanbul ignore next */
const db =
  environment === "testing" ? process.env.TEST_DB : process.env.PRODUCTION_DB;

/* istanbul ignore next */
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } catch (err) {
    throw err;
  }
};

export default connectDB;
