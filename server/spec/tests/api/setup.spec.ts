import mongoose from "mongoose";
//
import Admin from "../../../src/models/Admin";
import User from "../../../src/models/User";
import BlogPost from "../../../src/models/BlogPost";
// server //
import { ServerInstance } from "../../../src/server";

before(async function () {
  this.timeout(20000);
  try {
    console.log("ran init");
    await ServerInstance.init({ testMode: true });
    console.log("finished init")
  } catch (error) {
    throw error;
  }
});
after(async () => {
  try {
    await Admin.deleteMany({});
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await mongoose.disconnect();
    await ServerInstance.nextAppServer.close();
  } catch (error) {
    console.log(error);
  }
});

export {};