import mongoose from "mongoose";

export default async function mongoSetup(): Promise<void> {
  console.log("running db setup");
  console.log("Environmnt is: " + process.env.NODE_ENV);
  
  if (process.env.NODE_ENV === "production") {
    /// we will get to this later //
    throw new Error("Need a production database");
  } else if (process.env.NODE_ENV === "test") {
    // for tests later  //
    // need to set up a test database //
    await mongoose.connect('mongodb://localhost:27017/ezie_tech_testing');
  } else {
    await mongoose.connect('mongodb://localhost:27017/ezie_tech_development');
  }
}