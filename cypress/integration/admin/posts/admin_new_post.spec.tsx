/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
import { getTestElement, closestBySelector } from "../../../helpers/generalHelpers";
//
import faker from "faker";
//
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { BlogPostData, IBlogPostState } from "@/redux/_types/blog_posts/dataTypes";
import type { IBlogPost } from "@/server/src/models/BlogPost";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/users/dataTypes";

// helpers //
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";
import { generateMockPostData } from "@/server/spec/hepers/testHelpers";

describe("Admin New Post page tests", () => {
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
          return cy.task<{ blogPosts: BlogPostData[]}>("seedBlogPosts", { number: 0, publishedStatus: "published", user })
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
          getTestElement("Login_Page_Email_Input").type(user.email);
          getTestElement("Login_Page_Password_Input").type("password");
          getTestElement("Login_Page_Login_Btn").click();
          //
        });
      cy.wait(6000)
      cy.visit("/admin/dashboard/posts/new");
      
        
    })

    it("Should render correct components", () => {
      getTestElement("Admin_New_Post_Form")
        .should("be.visible");
      getTestElement("Admin_Post_Preview")
        .should("be.visible");
    });

    it("Should set correct default values in the input and preview", () => {
      // form //
      // form default values //
      getTestElement("Admin_New_Post_Title_Input")
        .should("be.visible").and("have.value", "")
      getTestElement("Admin_New_Post_Keywords_Input")
        .should("be.visible").and("have.value", "")
      // category dropdown //
      getTestElement("Admin_New_Post_Category_Input")
        .should("be.visible").and("have.value","");
      // category dropdown values //
      getTestElement("Admin_New_Post_Category_Input").click()
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
      getTestElement("Admin_New_Post_Content_Input")
        .should("be.visible").and("have.value", "");
      
      // post preview component ///
      // post preview values //
      getTestElement("Post_Title_Preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(1);
          expect(spanEls.first().html()).to.equal("Title:")
        });
      getTestElement("Post_Author_Preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(2);
          expect(spanEls.first().html()).to.equal("Author:")
        });
      getTestElement("Post_Category_Preview")
        .should("be.visible")
        .find("span")
        .then((spanEls) => {
          expect(spanEls.length).to.equal(1);
          expect(spanEls.first().html()).to.equal("Category:")
        });
        getTestElement("Post_Keywords_Preview")
          .should("be.visible")
          .find("span")
          .then((spanEls) => {
            expect(spanEls.length).to.equal(1);
            expect(spanEls.first().html()).to.equal("Keywords:")
          });
     
    });

    it("Should correctly handle changing values in <PostForm> and update <AdminPostPreview> components", () => {
      const numOfKeywords: number = 5;
      const postTitle: string = faker.lorem.word();
      const keywordsArr: string[] = faker.lorem.words(numOfKeywords).split(" ")
      const keywordsCSVString: string = keywordsArr.join(",");
      // title input-preview test //
      getTestElement("Admin_New_Post_Title_Input").type(postTitle)
      getTestElement("Post_Title_Preview").find("span").last().should("have.text", postTitle);
      // category dropdown select tests //
      for (let i = 0; i < 4; i++) {
        getTestElement("Admin_New_Post_Category_Input").click()
          .then((dropdown) => {
            dropdown.find(".item").toArray()[i].click();
            // check against preview value //
          });
        getTestElement("Post_Category_Preview").find("span")
          .should("have.length", 2)
          .then((els) => {
            expect(els.last().text()).to.equal(capitalizeString(dropdownVals[i]));
        })
      }
    
      // keywords input-preview-test //
      getTestElement("Admin_New_Post_Keywords_Input").type(keywordsCSVString);
      getTestElement("Post_Keyword_Preview_Span")
        .should("have.length", numOfKeywords)  
        .then((elements) => {
          elements.toArray().forEach((el, index) => {
            expect(el.innerHTML).to.equal(keywordsArr[index]);
          });
        });  
      //   
    });

    it.only("Should correctly handle all data, correctly submit and create a new <BlogPost>, update state", () => {
      // get current user info //
      let authState: IAuthState;
      cy.window().its("store").invoke("getState").then((state) => {
        authState = { ...state.authState, currentUser: { ...state.authState.currentUser }};
      })
      .then(() => {
        const newPostData = generateMockPostData({ name: authState.currentUser.firstName, authorId: authState.currentUser._id });
        // type in values //
        getTestElement("Admin_New_Post_Category_Input").click().then((dropdown) => dropdown.find(".item").toArray()[0].click());
        getTestElement("Admin_New_Post_Keywords_Input").type(newPostData.keywords.join(","));
        getTestElement("Admin_New_Post_Content_Input").type(newPostData.content);
        //
        //cy.getByDataAttr("post-save-btn").should("be.visible");
        cy.getByDataAttr("post-cancel-btn").should("be.visible");
      })
     
      //
    });

  });

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
})