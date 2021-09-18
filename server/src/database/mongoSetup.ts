import mongoose from "mongoose";

export default async function mongoSetup(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    /// we will get to this later //
    throw new Error("Need a production database");
  } else if (process.env.NODE_ENV === "test") {
    // for tests later  //
    // need to set up a test database //
    throw new Error("Need a test database");
  } else {
    await mongoose.connect('mongodb://localhost:27017/ezie_tech_development');
  }
}