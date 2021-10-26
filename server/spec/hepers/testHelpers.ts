import faker from "faker";
// 
import BlogPost from "../../src/models/BlogPost";
// types //
import type { Express} from "express";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";

export const processBlogPostTestError = () => {

};

export const loginUser = async ({ chai, server, email}: { chai: Chai.ChaiStatic; server: Express; email: string }): Promise<{ userJWTToken: string; }> => {
  return new Promise((resolve, reject) => {
    chai.request(server)
      .post("/api/login")
      .send({ email, password: "password" })
      .end((err, res) => {
        if (err) return reject(err);
        if (res.status === 200) {
          const { jwtToken } = res.body as LoginRes;
          return resolve({ userJWTToken: jwtToken.token });
        } else {
          return reject((new Error("Could not login user")));
        };
      });
  });
};

export const countBlogPosts = async ({ all, published, unpublished, specificUserId }: { all?: boolean; published?: boolean; unpublished?: boolean; specificUserId?: string; }): Promise<number> => {
  let totalNumber: number;
  try {
    if (specificUserId) {
      if (published) {
        totalNumber = await BlogPost.countDocuments({ "author.authorId": specificUserId }).where({ published: true });
      } else if (unpublished) {
        totalNumber = await BlogPost.countDocuments({ "author.authorId": specificUserId }).where({ published: false });
      } else {
        totalNumber = await BlogPost.countDocuments({ "author.authorId": specificUserId });
      }
    } else if (published && !specificUserId) {
      totalNumber = await BlogPost.countDocuments({}).where({ published: true });
    } else if (unpublished && !specificUserId) {
      totalNumber = await BlogPost.countDocuments({}).where({ published: false });
    } else {
      // count all //
      totalNumber = await BlogPost.countDocuments({});
    }
  } catch (error) {
    throw error;
  }
  return totalNumber;
};

export const generateMockPostData = ({ authorId, name }: { authorId: string; name: string }): BlogPostClientData => {
  return {
    title: faker.lorem.word(),
    author: { authorId, name },
    content: faker.lorem.paragraphs(),
    keywords: ["keyword"],
    category: "beginner",
    published: false,
  }
};
export const generateMockUserData = (): ReqUserData => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: "password",
    confirmPassword: "password",
  };
};
