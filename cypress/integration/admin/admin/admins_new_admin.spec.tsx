/// <reference types="cypress" />
/// <reference types="cypress-pipe" />
import { expect } from "chai";
//
import faker from "faker";
//
import type { StaticResponse } from "cypress/types/net-stubbing";
import type { IGeneralState } from "@/redux/_types/generalTypes"
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { AdminData, CreateAdminRes, ErrorAdminRes } from "@/redux/_types/admins/dataTypes";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/admins/dataTypes";
import type { ReqAdminData } from "@/server/src/_types/admins/adminTypes"

// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "@/components/_helpers/displayHelpers";
import { generateMockAdminData } from "@/server/spec/hepers/testHelpers";

describe("Admin New Post page tests", () => {
  let appState: IGeneralState;
  let adminsArr: AdminData[];
  //
  let newAdminData: ReqAdminData;
  let newCreatedAdmin: AdminData;
  let adminsArr: AdminData[];
  let mockErrorResponse: ErrorAdminRes;
  //
  let adminJWTToken: string;
  let adminAdmin: AdminData;
  //
  let adminIds: string[];
  let adminIds: string[];

  const adminRole: string[] = [ "READER", "CONTRIBUTOR" ];

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "owner" });
        })
        .then(({ admins }) => {
          adminsArr = admins;
          adminAdmin = adminsArr[0];
          adminIds = admins.map((adminData) => adminData._id);
          return cy.task<{ admins: AdminData[]}>("seedBlogPosts", { number: 10, confirmed: true });
        })
        .then(({ admins }) => { 
          adminsArr = admins;
          adminIds = adminsArr.map((adminData) => adminData._id);
          const { email } = adminAdmin;
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
        cy.getByDataAttr("login-page-email-input").type(adminAdmin.email);
        cy.getByDataAttr("login-page-password-input").type("password");
        cy.getByDataAttr("login-page-login-btn").click();
        //
        cy.getByDataAttr("admin-main-page").should("exist");
        cy.wait(5000)
        return cy.window().its("store").invoke("getState")
      })
      .then((state) => {
        appState = deepCopyObject<IGeneralState>(state);
        return cy.visit("/admin/dashboard/admins/new");
      })     
      .then(() => {
        cy.getByDataAttr("new-admin-main-row").should("be.visible");
      });        
  });

  it("Should render correct components and correct default values", () => {
    cy.getByDataAttr("admin-save-btn").should("be.visible").contains("Save");
    cy.getByDataAttr("admin-cancel-btn").should("be.visible").contains("Cancel");
    //
    cy.getByDataAttr("admin-admin-form").should("exist").and("be.visible");
    // assert correct blank form rendering //
    cy.getByDataAttr("admin-admin-form-first-name").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-admin-form-last-name").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-admin-form-email").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-admin-form-password").should("be.visible").and("have.value", "");
    cy.getByDataAttr("admin-admin-form-password-confirm").should("be.visible").and("have-value", "");
    //
    // admin state should not have a currently selected admin //
    // auth state should not change //
    cy.window().its("store").invoke("getState").its("authState").should("deep.equal", appState.authState);
    cy.window().its("store").invoke("getState").its("adminsState").its("selectedAdminData").should("deep.equal", appState.adminsState.selectedAdminData);
  })
});