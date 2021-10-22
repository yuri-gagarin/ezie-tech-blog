import mongoose from "mongoose";
//
import Admin from "../../../src/models/Admin";
import User from "../../../src/models/User";
import BlogPost from "../../../src/models/BlogPost";

after(async () => {
  try {
    await Admin.deleteMany({});
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
});

export {};