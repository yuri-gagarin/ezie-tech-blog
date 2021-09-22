import faker from "faker";
import BlogPost from "../models/BlogPost";
import { randomIntFromInterval } from "./generalHelpers";

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

export const generateMockBlogPosts = async () => {
  console.log("Generating mock Blog Posts");
  for (let i = 0; i < 5; i++) {
    const categories = ["informational", "beginner", "intermediate", "advanced"];
    let keywords = ["programming", "tech", "help", "javascript", "typescript", "nodejs", "html", "css", "react", "react-native", "mobile", "desktop", "ruby", "python", "next", "gatsby", "mongodb", "sql" ];
    const ranNum: number = randomIntFromInterval(1, 20);
    try {
      await BlogPost.create({ 
        title: faker.lorem.words(),
        author: faker.name.firstName(),
        content: faker.lorem.paragraphs(ranNum === 0 ? 1 : ranNum),
        likes: [],
        numOfLikes: 0,
        keywords: pullRandomValsFromArray<string>(keywords),
        category: categories[randomIntFromInterval(0, categories.length - 1)],
        live: true
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  console.log("Done generation mock Blog Posts");
};

