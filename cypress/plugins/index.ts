/// <reference types="cypress" />
import { loginUser } from "../../server/spec/hepers/testHelpers";
import { generateMockAdmins, generateMockUsers, generateMockBlogPosts, generateMockProjects } from "../../server/src/_helpers/mockDataGeneration";
//
import Admin from "../../server/src/models/Admin";
import User from "../../server/src/models/User";
import BlogPost from "../../server/src/models/BlogPost";
//
import mongoSetup from "../../server/src/database/mongoSetup";
//
import type { IAdmin } from "../../server/src/models/Admin";
import type { IUser } from "../../server/src/models/User";
import type { IBlogPost } from "../../server/src/models/BlogPost";
import type { LoginRes } from "../../redux/_types/auth/dataTypes";
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    async connectToDB() {
      await mongoSetup();
      return true;
    },
    async seedUsers({ number, confirmed, type }: { number?: number; confirmed?: boolean; type?: "READER" | "CONTRIBUTOR" }): Promise<{ users: IUser[] }> {
      await generateMockUsers({ number, confirmed, type });
      const users: IUser[] = await User.find({});
      return { users };
    },
    async seedAdmins({ number, role }: { number?: number; role?: "admin" | "owner"; }): Promise<{ admins: IAdmin[] }> {
      try {
        const admins = await generateMockAdmins(number, role);
        return { admins };
      } catch (error) {
        throw error;
      }
    },
    async seedBlogPosts({ number, publishedStatus, user }: { number?: number; publishedStatus?: "published" | "unpublished"; user?: IUser | IAdmin; }): Promise<{ blogPosts: IBlogPost[] }> {
      try {
        const blogPosts = await generateMockBlogPosts({ number, publishedStatus, user });
        return { blogPosts };
      } catch (error) {
        throw error;
      }
    },
    async deleteBlogPostModels(blogPostIds: string[]) {
      try {
        return BlogPost.deleteMany({ _id: { $in: blogPostIds } });
      } catch (error) {
        throw error;
      }
    },
    async deleteAdminModels(adminModelIds: string[]) {
      try {
        return Admin.deleteMany({ _id: { $in: adminModelIds } });
      } catch (error) {
        throw error;
      }
    },
    async deleteUserModels(userModelIds: string[]) {
      try {
        return await User.deleteMany({ _id: { $in: userModelIds } });
      } catch (error) {
        throw error;
      }
    }
    /*
    async handleLoginUser({ email, password, cy }: { email: string; password: string; cy: any }) {
      try {
        cy.request<LoginRes>("POST", "api/login",  { email, password })
          .then((response) => {
            return response;
          })
      } catch (error) {
        throw error;
      }
    }
    */
  
  })
}
