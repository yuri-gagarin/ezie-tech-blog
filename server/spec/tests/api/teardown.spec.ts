import mongoose from "mongoose";
//
import User from "../../../src/models/User";
import BlogPost from "../../../src/models/BlogPost";

after(async () => {
  try {
    await BlogPost.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
});

export {};