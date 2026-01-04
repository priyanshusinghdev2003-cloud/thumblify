import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URI!)
      .then(() => {
        console.log("Connected to MongoDB", mongoose.connection.host);
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
      });
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
