/// <reference types="cypress" />
/// <reference types="cypress-pipe" />
import { expect } from "chai";
//
import faker from "faker";
//
import type { StaticResponse } from "cypress/types/net-stubbing";
import type { IGeneralState } from "@/redux/_types/generalTypes"
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { BlogPostData, CreateBlogPostRes, ErrorBlogPostRes } from "@/redux/_types/blog_posts/dataTypes";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/users/dataTypes";
import type { BlogPostClientData } from "@/server/src/_types/blog_posts/blogPostTypes";

// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";
import { generateMockPostData } from "@/server/spec/hepers/testHelpers";

describe("Admin New Post page tests", () => {
  let appState: IGeneralState;
  let adminsArr: AdminData[];
  //
  let newPostData: BlogPostClientData
  let newBlogPost: BlogPostData;
  let blogPostsArr: BlogPostData[];
  let mockErrorResponse: ErrorBlogPostRes;
  //
  let adminJWTToken: string;
  let user: AdminData;
  //
  let adminIds: string[];
  let blogPostIds: string[];

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
          adminIds = admins.map((adminData) => adminData._id);
          return cy.task<{ blogPosts: BlogPostData[]}>("seedBlogPosts", { number: 10, publishedStatus: "published", user })
        })
        .then(({ blogPosts}) => { 
          blogPostsArr = blogPosts;
          blogPostIds = blogPostsArr.map((blogPostData) => blogPostData._id);
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

  before(() => {
    newPostData = generateMockPostData({ name: user.firstName, authorId: user._id });
    mockErrorResponse = { responseMsg: "Error Occured", error: new Error("Oooooops"), errorMessages: [ "An error occured" ]};
  });

  describe("Admin new blog posts page - normal render", () => {
    beforeEach(() => {
      cy.visit("/login")
        .then(() => {
          cy.getByDataAttr("login-page-email-input").type(user.email);
          cy.getByDataAttr("login-page-password-input").type("password");
          cy.getByDataAttr("login-page-login-btn").click();
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

    it("Should correctly handle all data, CORRECTLY handle creation of a <BlogPost>, AND update state", () => {
      // get current user info //
      let authState: IAuthState;
      cy.intercept({ method: "POST", url: "/api/posts"}).as("createBlogPost");
      //
      cy.window().its("store").invoke("getState").then((state) => {
        authState = { ...state.authState, currentUser: { ...state.authState.currentUser }};
      })
      .then(() => {
        // type in values //
        cy.getByDataAttr("post-form-title-input").type(newPostData.title);
        cy.getByDataAttr("post-form-category-input").click().then((dropdown) => dropdown.find(".item").toArray()[0].click());
        cy.getByDataAttr("post-form-keywords-input").type(newPostData.keywords.join(","));
        cy.getByDataAttr("post-form-content-input").type(newPostData.content);
        //
      })
      .then(() => {
        cy.getByDataAttr("post-save-btn").click();
        return cy.wait("@createBlogPost")
      })
      .then((interception) => {
        const { responseMsg, createdBlogPost, error, errorMessages } = interception.response.body as CreateBlogPostRes;
        expect(responseMsg).to.be.a("string");
        expect(createdBlogPost).to.be.an("object");
        expect(error).to.be.undefined;
        expect(errorMessages).to.be.undefined;
        // needed for cleanup //
        newBlogPost = createdBlogPost
        blogPostIds.push(createdBlogPost._id);
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
          const blogPost = blogPosts.filter((postData) => postData._id === newBlogPost._id)[0];
          //
          expect(status).to.equal(200);
          expect(responseMsg).to.be.a("string");
          expect(loading).to.equal(false);
          expect(blogPosts.length).to.equal(oldBlogPostsState.blogPosts.length + 1);
          expect(checkEmptyObjVals(currentBlogPost)).to.equal(true);
          expect(error).to.be.null;
          expect(errorMessages).to.be.null;
          // created blog post should be in new loaded state //
          expect(blogPost).to.be.an("object");
        });
      });
    });

    // with simulated error response //
    it.only("Should correctly handle all data, CORRECTLY handle creation of a <BlogPost>, AND update state", () => {
      const errorResponse: StaticResponse = { statusCode: 400, body: mockErrorResponse };
      // get current user info //
      let authState: IAuthState;
      cy.intercept({ method: "POST", url: "/api/posts"}, errorResponse).as("createBlogPost");
      //
      cy.window().its("store").invoke("getState").then((state) => {
        authState = { ...state.authState, currentUser: { ...state.authState.currentUser }};
      })
      .then(() => {
        // type in values //
        cy.getByDataAttr("post-form-title-input").type(newPostData.title);
        cy.getByDataAttr("post-form-category-input").click().then((dropdown) => dropdown.find(".item").toArray()[0].click());
        cy.getByDataAttr("post-form-keywords-input").type(newPostData.keywords.join(","));
        cy.getByDataAttr("post-form-content-input").type(newPostData.content);
        //
      })
      .then(() => {
        cy.getByDataAttr("post-save-btn").click();
        return cy.wait("@createBlogPost")
      })
      .then((interception) => {
        const { responseMsg, createdBlogPost, error, errorMessages } = interception.response.body as CreateBlogPostRes;
        expect(responseMsg).to.be.a("string");
        expect(error).to.be.an("object")
        expect(errorMessages).to.be.an("array");
        //
        expect(createdBlogPost).to.be.undefined;
      })
      .then(() => {
        // url should not change //
        cy.url().should("eql", "http://localhost:3000/admin/dashboard/posts/new");
        cy.getByDataAttr("admin-post-form").should("exist").and("be.visible");
        cy.getByDataAttr("post-preview").should("exist").and("be.visible");
        cy.getByDataAttr("post-nav-main").should("exist").and("be.visible");
        // data in form and preview should not change //
        cy.getByDataAttr("post-form-title-input").should("have.value", newPostData.title);
        cy.getByDataAttr("post-form-keywords-input").should("have.value", newPostData.keywords.join(","));
        cy.getByDataAttr("post-form-category-input").find(".divider").contains("Informational");
        //cy.getByDataAttr("post-form-content-input").should("have.value", newPostData.content);
      })
      .then(() => {
        // redux state shoul change to reflect a new blog post model //
        cy.wait(4000)
        cy.window().its("store").invoke("getState").then((state) => {
          const { blogPostsState: oldBlogPostsState } = appState;
          const { status, responseMsg, loading, blogPosts, currentBlogPost, error, errorMessages } = state.blogPostsState;
          //
          expect(status).to.equal(400);
          expect(responseMsg).to.be.a("string");
          expect(loading).to.equal(false);
          expect(blogPosts.length).to.equal(0); // should be no api call to fetch updated posts //
          expect(checkEmptyObjVals(currentBlogPost)).to.equal(true);
          expect(error).to.not.be.null;
          expect(errorMessages).to.eql(mockErrorResponse.errorMessages);
        });
      });
    });

  });

  after(() => {  
    try {
      cy.task("deleteAdminModels", adminIds)
        .then(() => {
          return cy.task("deleteBlogPostModels", blogPostIds)
        });
    } catch (error) {
      throw (error);
    }
  
  });
})