import mongoose from "mongoose";
import faker from "faker";
// models //
import Admin from "../models/Admin";
import User from "../models/User";
import BlogPost from "../models/BlogPost";
import Project from "../models/Project";
// helpers //
import { randomIntFromInterval, setRandBoolean } from "./generalHelpers";
// types //
import type { IProject } from "../models/Project";
import type { IAdmin } from "../models/Admin";
import type { IUser } from "../models/User";


const pullRandomValsFromArray = <T>(array: T[]): T[] => {
  let returnArr: T[] = array
    .map((val) => {
      const randomNum = randomIntFromInterval(0, 1);
      if (randomNum) return val;
      else return null;
    })
    .filter((val) => val !== null);
  return returnArr;
};

export const generateMockBlogPosts = async ({ number, publishedStatus, user }: { number?: number; publishedStatus?: "published" | "unpublished"; user?: (IUser | IAdmin ); }) => {
  const numOfBlogPosts = number ? number : 10;
  for (let i = 0; i < numOfBlogPosts; i++) {
    const categories = ["informational", "beginner", "intermediate", "advanced"];
    let keywords = ["programming", "tech", "help", "javascript", "typescript", "nodejs", "html", "css", "react", "react-native", "mobile", "desktop", "ruby", "python", "next", "gatsby", "mongodb", "sql" ];
    const ranNum: number = randomIntFromInterval(1, 20);
    try {
      const randomUser: IUser | IAdmin = user ? user : await User.findOne({}).limit(1);
      let published: boolean;
      if (publishedStatus) published = publishedStatus === "published" ? true : false;
      else published = randomIntFromInterval(0, 1) ? true : false

      if (!randomUser) throw new Error("No user model was found to tie the blog post to");
     
      else {
        const { _id: authorId, firstName: name } = randomUser;
        await BlogPost.create({ 
          title: faker.lorem.words(),
          author: { authorId, name },
          content: faker.lorem.paragraphs(ranNum),
          likes: [],
          numOfLikes: 0,
          keywords: pullRandomValsFromArray<string>(keywords),
          category: categories[randomIntFromInterval(0, categories.length - 1)],
          published
        });
      }
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};

export const generateMockProjects = async (num?: number): Promise<number> => {
  const numToGenerate: number = num ? num : 1;

  for (let i = 0; i < num; i++) {
    const newProject: IProject = new Project({
      title: faker.lorem.words(randomIntFromInterval(1, 4)),
      creator: new mongoose.Types.ObjectId(),
      description: faker.lorem.paragraphs(randomIntFromInterval(1, 3)),
      challenges: faker.lorem.paragraphs(randomIntFromInterval(2, 4)),
      solution: faker.lorem.paragraphs(randomIntFromInterval(2, 4)),
      languages: {
        js: setRandBoolean(), ts: setRandBoolean(), python: setRandBoolean(), ruby: setRandBoolean(), cSharp: setRandBoolean(), goLang: setRandBoolean()
      },
      libraries: {
        bootstrap: setRandBoolean(), semanticUI: setRandBoolean(), materialUI: setRandBoolean(), jquery: setRandBoolean(), react: setRandBoolean(), reactNative: setRandBoolean(), redux: setRandBoolean(), socketIO: setRandBoolean()
      },
      frameworks: {
        rails: setRandBoolean(), nextJS: setRandBoolean(), gatsbyJS: setRandBoolean(), django: setRandBoolean(), flask: setRandBoolean(), ASP: setRandBoolean()
      },
      images: [],
      published: false,
      createdAt: new Date(),
      editedAt: new Date()
    });
    try {
      await newProject.save();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  return numToGenerate;
};

export const generateMockAdmins = async (num?: number): Promise<void> => {
  const numToGenerate: number = num ? num : 10;
  for (let i = 0; i < numToGenerate; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `${firstName}_${lastName}@mail.com`;
    const admin = new Admin({
      firstName,
      lastName,
      email,
      password: "password",
      role: randomIntFromInterval(0, 1) ? "admin" : "owner",
      confirmed: randomIntFromInterval(0, 1) ? true : false
    });
    try {
      await admin.save();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  } 
}
export const generateMockUsers = async (num?: number): Promise<void> => {
  const numToGenerate: number = num ? num : 10;
  for (let i = 0; i < numToGenerate; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `${firstName}_${lastName}@mail.com`;
    const user = new User({
      firstName,
      lastName,
      email,
      password: "password",
      confirmed: randomIntFromInterval(0, 1) ? true : false
    });
    try {
      await user.save();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  } 
}


