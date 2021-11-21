/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
import { getTestElement, closestBySelector } from "../../../helpers/generalHelpers";
//
import faker from "faker";
//
import type { IGeneralState } from "@/redux/_types/generalTypes"
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { BlogPostData, IBlogPostState } from "@/redux/_types/blog_posts/dataTypes";
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/users/dataTypes";

// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";
import { generateMockPostData } from "@/server/spec/hepers/testHelpers";

describe("Admin New Post page tests", () => {
  let appState: IGeneralState;
  let adminsArr: AdminData[];
  let blogPostsArr: BlogPostData[];
  let adminJWTToken: string;
  let user: AdminData;
  //
  const dropdownVals: string[] = ["informational", "beginner", "intermediate", "advanced"];

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "owner" });
        })
        .then(({ admins }) => {
          adminsArr = admins;
          user = adminsArr[0];
          return cy.task<{ blogPosts: BlogPostData[]}>("seedBlogPosts", { number: 10, publishedStatus: "published", user })
        })
        .then(({ blogPosts}) => { 
          blogPostsArr = blogPosts;
          const { email } = user;
          return cy.request<LoginRes>("POST", "api/login",  { email, password: "password" })
        })
        .then((loginData) => {
          const { jwtToken } = loginData.body;
          adminJWTToken = jwtToken.token;
        });
      //
    } catch (error) {
      throw error;
    }
  });

  describe("Admin new blog posts page - normal render", () => {
    beforeEach(() => {
      cy.visit("/login")
        .then(() => {
          cy.getByDataAttr("Login_Page_Email_Input").type(user.email);
          cy.getByDataAttr("Login_Page_Password_Input").type("password");
          cy.getByDataAttr("Login_Page_Login_Btn").click();
          //
          cy.getByDataAttr("admin-main-page").should("exist");
          cy.wait(5000)
          return cy.window().its("store").invoke("getState")
        })
        .then((state) => {
          console.log(state.blogPostsState);
          appState = deepCopyObject<IGeneralState>(state);
          return cy.visit("/admin/dashboard/posts/new");
        })     
        .then(() => {
          cy.getByDataAttr("new-post-main-row").should("be.visible");
        });        
    });

    it("Should render correct components", () => {
      cy.getByDataAttr("post-save-btn").should("be.visible").contains("Save");
      cy.getByDataAttr("post-cancel-btn").should("be.visible").contains("Cancel");
      //
      cy.getByDataAttr("admin-post-form").should("exist").and("be.visible");
      cy.getByDataAttr("post-preview").should("exist").and("be.visible");
    });

    // empty state data render tests //
    it("Should set correct default values in the input and preview", () => {
      // form //
      // form default values //
      cy.getByDataAttr("post-form-title-input")
        .should("be.visible").and("have.value", "")
      cy.getByDataAttr("post-form-keywords-input")
        .should("be.visible").and("have.value", "")
      // category dropdown //
      cy.getByDataAttr("post-form-category-input")
        .should("be.visible").and("have.value","");
      // category dropdown values //
      cy.getByDataAttr("post-form-category-input").click()
        .then((dropdown) => {
          return dropdown.find(".item");
        })
        .then((dropdownItems) => {
          expect(dropdownItems.length).to.equal(4);
          //
          dropdownItems.toArray().forEach((dropdownItem, index) => {
            expect(dropdownItem.firstChild.textContent).to.equal(capitalizeString(dropdownVals[index]));
          })
        });
      // content input // 
      cy.getByDataAttr("post-form-content-input")
        .should("be.visible").and("have.value", "");
      
      // post preview component ///
      // post preview values //
      cy.getByDataAttr("post-title-preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(1);
          expect(spanEls.first().html()).to.equal("Title:")
        });
      cy.getByDataAttr("post-author-preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(2);
          expect(spanEls.first().html()).to.equal("Author:")
        });
      cy.getByDataAttr("post-category-preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(1);
          expect(spanEls.first().html()).to.equal("Category:")
        });
        cy.getByDataAttr("post-keywords-preview")
          .should("be.visible")
          .find("span")
          .then((spanEls) => {
            expect(spanEls.length).to.equal(1);
            expect(spanEls.first().html()).to.equal("Keywords:")
          });
     
    });

    // changing state data render tests //
    it("Should correctly handle changing values in <PostForm> and update <AdminPostPreview> components", () => {
      const numOfKeywords: number = 5;
      const postTitle: string = faker.lorem.word();
      const keywordsArr: string[] = faker.lorem.words(numOfKeywords).split(" ")
      const keywordsCSVString: string = keywordsArr.join(",");

      // title input-preview test //
      cy.getByDataAttr("post-form-title-input").type(postTitle)
      cy.getByDataAttr("post-title-preview").find("span").last().should("have.text", postTitle);
      // category dropdown select tests //
      for (let i = 0; i < 4; i++) {
        cy.getByDataAttr("post-form-category-input").click()
          .then((dropdown) => {
            dropdown.find(".item").toArray()[i].click();
            // check against preview value //
          });
        cy.getByDataAttr("post-category-preview").find("span")
          .should("have.length", 2)
          .then((els) => {
            expect(els.last().text()).to.equal(capitalizeString(dropdownVals[i]));
        })
      }
    
      // keywords input-preview-test //
      cy.getByDataAttr("post-form-keywords-input").type(keywordsCSVString);
      cy.getByDataAttr("post-keyword-preview-span")
        .should("have.length", numOfKeywords)  
        .then((elements) => {
          elements.toArray().forEach((el, index) => {
            expect(el.innerHTML).to.equal(keywordsArr[index]);
          });
        });  
      //   
    });

    it("Should correctly handle all data, correctly correctly cancel creation of a <BlogPost>, NOT update state", () => {
      // get current user info //
      let authState: IAuthState;
      cy.window().its("store").invoke("getState").then((state) => {
        authState = { ...state.authState, currentUser: { ...state.authState.currentUser }};
      })
      .then(() => {
        const newPostData = generateMockPostData({ name: authState.currentUser.firstName, authorId: authState.currentUser._id });
        // type in values //
        cy.getByDataAttr("post-form-title-input").type(newPostData.title);
        cy.getByDataAttr("post-form-category-input").click().then((dropdown) => dropdown.find(".item").toArray()[0].click());
        cy.getByDataAttr("post-form-keywords-input").type(newPostData.keywords.join(","));
        cy.getByDataAttr("post-form-content-input").type(newPostData.content);
        //
      })
      .then(() => {
        cy.getByDataAttr("post-cancel-btn").click();
      })
      .then(() => {
        // url should go back to all posts //
        cy.url().should("eql", "http://localhost:3000/admin/dashboard/posts");
        cy.getByDataAttr("admin-post-form").should("not.exist");
        cy.getByDataAttr("post-preview").should("not.exist");
        cy.getByDataAttr("post-nav-main").should("not.exist");
        //
        cy.getByDataAttr("dash-blog-posts-page").should("exist").and("be.visible");

      })
      .then(() => {
        // redux state should NOT change //
        cy.window().its("store").invoke("getState").then((state) => {
          expect(appState).to.eql(state);
        });
      });
    });

    it.only("Should correctly handle all data, CORRECTLY handle creation of a <BlogPost>, AND update state", () => {
      // get current user info //
      let authState: IAuthState;
      cy.window().its("store").invoke("getState").then((state) => {
        authState = { ...state.authState, currentUser: { ...state.authState.currentUser }};
      })
      .then(() => {
        const newPostData = generateMockPostData({ name: authState.currentUser.firstName, authorId: authState.currentUser._id });
        // type in values //
        cy.getByDataAttr("post-form-title-input").type(newPostData.title);
        cy.getByDataAttr("post-form-category-input").click().then((dropdown) => dropdown.find(".item").toArray()[0].click());
        cy.getByDataAttr("post-form-keywords-input").type(newPostData.keywords.join(","));
        cy.getByDataAttr("post-form-content-input").type(newPostData.content);
        //
      })
      .then(() => {
        cy.getByDataAttr("post-save-btn").click();
      })
      .then(() => {
        // url should go back to all posts //
        cy.url().should("eql", "http://localhost:3000/admin/dashboard/posts");
        cy.getByDataAttr("admin-post-form").should("not.exist");
        cy.getByDataAttr("post-preview").should("not.exist");
        cy.getByDataAttr("post-nav-main").should("not.exist");
        //
        cy.getByDataAttr("dash-blog-posts-page").should("exist").and("be.visible");

      })
      .then(() => {
        // redux state shoul change to reflect a new blog post model //
        cy.wait(4000)
        cy.window().its("store").invoke("getState").then((state) => {
          const { blogPostsState: oldBlogPostsState } = appState;
          const { status, responseMsg, loading, blogPosts, currentBlogPost, error, errorMessages } = state.blogPostsState;
          console.log(oldBlogPostsState.blogPosts.length)
          console.log(blogPosts.length)
          expect(status).to.equal(200);
          expect(responseMsg).to.be.a("string");
          expect(loading).to.equal(false);
          expect(blogPosts.length).to.equal(oldBlogPostsState.blogPosts.length + 1);
          expect(checkEmptyObjVals(currentBlogPost)).to.equal(true);
          expect(error).to.be.null;
          expect(errorMessages).to.be.null;
        });
      });
    });

  });

  /*
  after(() => {
    const ids: string[] = adminsArr.map(adminData => adminData._id);
    const blogPostIds: string[] = blogPostsArr.map(blogPostData => blogPostData._id);
    try {
      cy.task("deleteAdminModels", ids)
        .then(() => {
          return cy.task("deleteBlogPostModels", blogPostIds)
        });
    } catch (error) {
      throw (error);
    }
  });
  */
})