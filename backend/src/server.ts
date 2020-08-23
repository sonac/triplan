import mongoose from "mongoose";
import app from "./app";
import { logger } from "./app";

const dbUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";

const connectDb = () => {
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
      logger.info("Mongo is connected");
    })
    .catch((err) => {
      logger.info("Mongo is not connected:\n" + err.message);
      logger.info(dbUrl);
      setTimeout(connectDb, 5000);
    });
};

connectDb();
app.listen(process.env.BACKEND_PORT, () =>
  logger.info(`Listening on port ${process.env.BACKEND_PORT}`)
);
