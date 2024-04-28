import mongoose from "mongoose";
import { configuration } from "../Config";

const connectMongoDB = async () => {
  await mongoose
    .connect(configuration.databaseMongoUrl as string)
    .then(() => {
      console.log(
        `Connected to database successfully :: ${configuration.database_connected_to}`
      );
    })
    .catch((err) => {
      console.error("Failed to connect to database.", err.errorResponse.errmsg);
      process.exit(1);
    });
};

export default connectMongoDB;
