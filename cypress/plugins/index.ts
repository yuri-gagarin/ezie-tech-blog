/// <reference types="cypress" />
import { loginUser } from "../../server/spec/hepers/testHelpers";
import { generateMockAdmins, generateMockUsers, generateMockBlogPosts, generateMockProjects } from "../../server/src/_helpers/mockDataGeneration";
//
import Admin from "../../server/src/models/Admin";
import User from "../../server/src/models/User";
import BlogPost from "../../server/src/models/BlogPost";
//
import type { IAdmin } from "../../server/src/models/Admin";
import type { IUser } from "../../server/src/models/User";
import type { IBlogPost } from "../../server/src/models/BlogPost";
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

    async seedUsers({ number, confirmed, type }: { number?: number; confirmed?: boolean; type?: "READER" | "CONTRIBUTOR" }): Promise<{ users: IUser[] }> {
      try {
        await generateMockUsers({ number, confirmed, type });
        const users: IUser[] = await User.find({});
        return { users };
      } catch (error) {
        throw error;
      }
    },
    async seedAdmins({ number, role }: { number?: number; role?: "admin" | "owner"; }): Promise<{ admins: IAdmin[] }> {
      try {
        await generateMockAdmins(number, role);
        const admins: IAdmin[] = await Admin.find({});
        return { admins };
      } catch (error) {
        throw error;
      }
    },
    async seedBlogPosts({ number, publishedStatus, user }: { number?: number; publishedStatus?: "published" | "unpublished"; user?: IUser | IAdmin; }): Promise<{ blogPosts: IBlogPost[] }> {
      try {
        await generateMockBlogPosts({ number, publishedStatus, user });
        const blogPosts: IBlogPost[] = await BlogPost.find({});
        return { blogPosts };
      } catch (error) {
        throw error;
      }
    }
  })
}