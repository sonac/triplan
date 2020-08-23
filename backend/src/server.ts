import mongoose from "mongoose";
import app from "./app";

const dbUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";

const connectDb = () => {
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Mongo is connected");
    })
    .catch((err) => {
      console.log("Mongo is not connected:\n" + err.message);
      console.log(dbUrl);
      setTimeout(connectDb, 5000);
    });
};

connectDb();
app.listen(process.env.BACKEND_PORT, () =>
  console.log(`Listening on port ${process.env.BACKEND_PORT}`)
);
