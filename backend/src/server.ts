import mongoose from "mongoose";
import app from "./app";

const dbUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";

const connectDb = () => {
  return mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
  });
};

connectDb().then(async () =>
  app.listen(process.env.BACKEND_PORT, () =>
    console.log(`Listening on port ${process.env.BACKEND_PORT}`)
  )
);
