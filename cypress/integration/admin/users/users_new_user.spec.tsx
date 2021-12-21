/// <reference types="cypress" />
/// <reference types="cypress-pipe" />
import { expect } from "chai";
//
import faker from "faker";
//
import type { StaticResponse } from "cypress/types/net-stubbing";
import type { IGeneralState } from "@/redux/_types/generalTypes"
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { UserData, CreateUserRes, ErrorUserRes } from "@/redux/_types/users/dataTypes";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/users/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes"

// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "@/components/_helpers/displayHelpers";
import { generateMockUserData } from "@/server/spec/hepers/testHelpers";

describe("Admin New Post page tests", () => {
  let appState: IGeneralState;
  let adminsArr: AdminData[];
  //
  let newUserData: ReqUserData;
  let newCreatedUser: UserData;
  let usersArr: UserData[];
  let mockErrorResponse: ErrorUserRes;
  //
  let adminJWTToken: string;
  let adminUser: AdminData;
  //
  let adminIds: string[];
  let userIds: string[];

  const userRole: string[] = [ "READER", "CONTRIBUTOR" ];

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "owner" });
        })
        .then(({ admins }) => {
          adminsArr = admins;
          adminUser = adminsArr[0];
          adminIds = admins.map((adminData) => adminData._id);
          return cy.task<{ users: UserData[]}>("seedBlogPosts", { number: 10, confirmed: true });
        })
        .then(({ users }) => { 
          usersArr = users;
          userIds = usersArr.map((userData) => userData._id);
          const { email } = adminUser;
          return cy.request<LoginRes>("POST", "api/login",  { email, password: "password" });
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
    mockErrorResponse = { responseMsg: "Error Occured", error: new Error("Oooooops"), errorMessages: [ "An error occured" ]};
  });

  beforeEach(() => {
    cy.visit("/login")
      .then(() => {
        cy.getByDataAttr("login-page-email-input").type(adminUser.email);
        cy.getByDataAttr("login-page-password-input").type("password");
        cy.getByDataAttr("login-page-login-btn").click();
        //
        cy.getByDataAttr("admin-main-page").should("exist");
        cy.wait(5000)
        return cy.window().its("store").invoke("getState")
      })
      .then((state) => {
        appState = deepCopyObject<IGeneralState>(state);
        return cy.visit("/admin/dashboard/users/new");
      })     
      .then(() => {
        cy.getByDataAttr("new-user-main-row").should("be.visible");
      });        
  });

  it("Should render correct components and correct default values", () => {
    cy.getByDataAttr("user-save-btn").should("be.visible").contains("Save");
    cy.getByDataAttr("user-cancel-btn").should("be.visible").contains("Cancel");
    //
    cy.getByDataAttr("admin-user-form").should("exist").and("be.visible");
    // assert correct blank form rendering //
    cy.getByDataAttr("admin-user-form-first-name").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-user-form-last-name").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-user-form-email").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-user-form-password").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-user-form-password-confirm").should("be.visible").and("have-value", "");
    //
    // user state should not have a currently selected user //
    // auth state should not change //
    cy.window().its("store").invoke("getState").its("authState").should("deep.equal", appState.authState);
    cy.window().its("store").invoke("getState").its("usersState").its("selectedUserData").should("deep.equal", appState.usersState.selectedUserData);
  })
});