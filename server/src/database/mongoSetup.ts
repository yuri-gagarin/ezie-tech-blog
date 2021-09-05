import mongoose from "mongoose";

export default async function mongoSetup(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    /// we will get to this later //
  } else if (process.env.NODE_ENV === "test") {
    // for tests later  //
  } else {
    await mongoose.connect('mongodb://localhost:27017/ezie_tech_development');
  }
}