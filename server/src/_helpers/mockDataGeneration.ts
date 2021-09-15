import faker from "faker";
import BlogPost from "../models/BlogPost";

export const generateMockBlogPosts = async () => {
  console.log("Generating mock Blog Posts");
  for (let i = 0; i < 5; i++) {
    const ranNum: number = Math.round(Math.random() * 20);
    try {
      await BlogPost.create({ 
        title: faker.lorem.words(),
        author: faker.name.firstName(),
        content: faker.lorem.paragraphs(ranNum === 0 ? 1 : ranNum),
        keywords: [ "sports", "tech", "outdoors" ],
        live: true
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  console.log("Done generation mock Blog Posts");
};

