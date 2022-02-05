/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
// types 
import type { AdminData } from "@/redux/_types/admins/dataTypes";
import type { UserData} from "@/redux/_types/users/dataTypes";
import type { IAdminState, IGeneralState } from "@/redux/_types/generalTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "@/components/_helpers/displayHelpers";

/**
 * ONLY ADMIN accounts should have access to admin dashboard //
 * Regular user accounts and guests should not //
 */

describe("Admin dashboard navigation tets", () => {
  const adminEmail: string = "owner@email.com";
  const adminPass: string = "password";
  //
  let adminsArr: AdminData[];
  let ownerAdmin: AdminData;
  let regAdmin: AdminData;
  let regUser: UserData;
  let adminIds: string[];
  //
  let adminsState: IAdminState;
  let appState: IGeneralState;

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "owner" });
        })
        .then(({ admins }) => {
          adminsArr = [ ...admins ];
          ownerAdmin = adminsArr[0];
          return cy.task<{ admins: AdminData[]}>("seedBlogPosts", { number: 10, confirmed: true });
        })
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "admin" });
        })
        .then(({ admins }) => { 
          adminsArr = [ ...adminsArr, ...admins ];
          regAdmin = adminsArr[1];
          adminIds = adminsArr.map((adminData) => adminData._id);
          return cy.task<{ users: UserData[] }>("seedUsers", { number: 1, role: "READER" });
        })
        .then(({ users }) => {
          usersArr = [ ...users ];
          registeredUser = usersArr[0];
        })
      //
    } catch (error) {
      throw error;
    }
  });

  // login and navigate to dash //

  beforeEach(() => {
    cy.intercept({ method: "GET", url: "/api/posts" }).as("getAdmins");
  });
  context("Non admin user", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/login");
      //
      cy.getByDataAttr("login-page-email-input").type(adminEmail);
      cy.getByDataAttr("login-page-password-input").type(adminPass);
      // 
      cy.getByDataAttr("login-page-login-btn").click();
      //
      cy.getByDataAttr("admin-main-page").should("be.visible");
      //
      cy.wait("@getAdmins");
      cy.visit("http://localhost:3000/admin/dashboard/admins")
        .then(() => {
          cy.getByDataAttr("admin-admins-page").should("exist");
          //
          cy.window().its("store").invoke("getState").its("authState").its("currentAdmin").should("not.be.null");
          cy.window().its("store").invoke("getState").its('adminsState').its("adminsArr").should("have.length.above", 0);
          cy.window().its("store").invoke("getState").then((state) => {
            appState = deepCopyObject(state);
          });
            
        });
    });
    it("Should NOT render the admin page and reroute to proper 401 page", () => {

    });
  });
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    //
    cy.getByDataAttr("login-page-email-input").type(adminEmail);
    cy.getByDataAttr("login-page-password-input").type(adminPass);
    // 
    cy.getByDataAttr("login-page-login-btn").click();
    //
    cy.getByDataAttr("admin-main-page").should("be.visible");
    //
    cy.wait("@getAdmins");
    cy.visit("http://localhost:3000/admin/dashboard/admins")
      .then(() => {
        cy.getByDataAttr("admin-admins-page").should("exist");
        //
        cy.window().its("store").invoke("getState").its("authState").its("currentAdmin").should("not.be.null");
        cy.window().its("store").invoke("getState").its('adminsState').its("adminsArr").should("have.length.above", 0);
        cy.window().its("store").invoke("getState").then((state) => {
          appState = deepCopyObject(state);
        });
          
      });
  });

  it("Should correctly render all components at the <AdminAdmins> page", () => {
    //
    cy.getByDataAttr("admin-admins-page").should("be.visible");
    // assert correct state //
    cy.window().its("store").invoke("getState").its("adminsState").its("adminsArr").should("have.length.above", 0);
    cy.window().its("store").invoke("getState").then((state) => {
      // auth state should not change //
      expect(appState.authState).to.eql(state.authState);
      // blog posts state should update //
      adminsState = { ...state.adminState };
      const { status, loading, selectedAdminData, adminsArr, error, errorMessages } = adminsState;
      // check blogAdminState updates //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(checkEmptyObjVals(selectedAdminData)).to.equal(true);
      expect(adminsArr.length).to.be.lte(100);
      expect(errorMessages).to.be.null;
      expect(error).to.be.null;
        //
    })
    .then(() => {
      const adminsArrLength: number = adminsState.adminsArr.length;
      cy.getByDataAttr("admin-data-row").should("have.length", adminsArrLength);
    })
    .then(() => {
      const { adminsArr } = adminsState;
      cy.getByDataAttr("admin-name-div").each((elem, index) => {
        expect(elem.html()).to.equal(adminsArr[index].firstName);
      });
      cy.getByDataAttr("admin-email-div").each((elem, index) => {
        expect(elem.html()).to.equal(adminsArr[index].email);
      });
      cy.getByDataAttr("admin-confirmed-div").each((elem, index) => {
        expect(elem.html()).to.equal(adminsArr[index].confirmed);
      });
    })
    .then(() => {
      const adminsLength = adminsState.adminsArr.length
      cy.getByDataAttr("admin-view-btn").should("have.length",  adminsLength);
    });
    // assert correct blog post card rendering //
  });

  it("Should correctly toggle the preview modal and open the queried <Admin> model", () => {
    cy.getByDataAttr("admin-view-btn").first().click();
    // assert new state //
    cy.window().its("store").invoke("getState").its("adminsState").its("selectedAdminData").should("not.deep.equal", appState.adminState.selectedAdminData);
    cy.window().its("store").invoke("getState").then((state) => {
      adminsState = { ...state.adminState };
      const { status, loading, selectedAdminData, adminsArr, error, errorMessages } = adminsState;
      // auth state should stay the same //
      expect(appState.authState).to.eql(state.authState);
      // check adminsState updates //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(selectedAdminData).to.eql(adminsArr[0]);
      expect(adminsArr.length).to.be.lte(100);
      expect(errorMessages).to.be.null;
      expect(error).to.be.null;
      //
    }).then(() => {
      // admin view modal should be open //
      cy.getByDataAttr("admin-view-modal").should("be.visible");
      // ensure all buttons are present //
      cy.getByDataAttr("admin-modal-close-btn").should("be.visible").contains("Close");
      cy.getByDataAttr("admin-modal-confirm-btn").should("be.visible").contains("Confirm");
      cy.getByDataAttr("admin-modal-edit-btn").should("be.visible").contains("Edit");
      cy.getByDataAttr("admin-modal-delete-btn").should("be.visible").contains("Delete");
    }).then(() => {
      const { firstName, lastName, email, confirmed } = adminsState.selectedAdminData;
      // ensure corect data rendered //
      cy.getByDataAttr("admin-modal-first-name").contains("First Name: ").find("span").contains(firstName);
      cy.getByDataAttr("admin-modal-last-name").contains("Last Name: ").find("span").contains(lastName);
      cy.getByDataAttr("admin-modal-email").contains("Email: ").find("span").contains(email);
      cy.getByDataAttr("admin-modal-confirmed").contains("Confirmed: ").find("span").contains(`${confirmed ? "Yes" : "No"}`);
  
    }).then(() => {
      cy.getByDataAttr("admin-modal-close-btn").click();
      // modal should be closed //
      cy.getByDataAttr("admin-view-modal").should("not.exist");
    });
  });

  
  it("Should correctly handle the <Delete> CANCEL functionality", () => {
    //
    cy.getByDataAttr("admin-view-btn").first().click();
    cy.getByDataAttr("admin-modal-delete-btn").click();
    // confirm delete should be open //
    cy.getByDataAttr("confirm-delete-modal").should("exist").and("have.length", 1)
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("exist").and("have.length", 1);
    cy.getByDataAttr("confirm-delete-modal-delete-btn").should("exist").and("have.length", 1);
    // should successfully cancel //
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").click();
    
    cy.window().its("store").invoke("getState").its("adminsState").its("selectedAdminData").should("not.deep.equal", appState.adminState.selectedAdminData);
    cy.window().its("store").invoke("getState").then((state) => {
      expect(appState.authState).to.eql(state.authState);
    });
    // confirm delete modal should be closed //
    cy.getByDataAttr("confirm-delete-modal").should("not.exist");
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("not.exist");
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("not.exist");

  });

  it("Should correctly handle the <Delete> CONFIRM DELETE functionality", () => {
    cy.getByDataAttr("admin-view-btn").first().click();
    cy.getByDataAttr("adminmodal-delete-btn").click();    
    // confirm delete should be open //
    cy.getByDataAttr("confirm-delete-modal").should("exist").and("have.length", 1)
    cy.getByDataAttr("confirm-delete-modal-delete-btn").should("exist").and("have.length", 1);
    // should successfully cancel //
    // redux auth state should stay the same //
    cy.getByDataAttr("confirm-delete-modal-delete-btn").click().then(() => {
      return cy.window().its("store").invoke("getState");
    })
    .then((state) => {
      const { status, loading, responseMsg, selectedAdminData, adminsArr, error, errorMessages } = state.adminState;
      // changed <BlogAdmins> state //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(responseMsg).to.be.a("string");
      expect(checkEmptyObjVals(selectedAdminData)).to.equal(true);
      expect(adminsArr.length).to.equal(appState.adminState.adminsArr.length - 1);
      expect(error).to.be.null;
      expect(errorMessages).to.be.null;
    });
    // confirm delete modal should be closed //
    cy.getByDataAttr("confirm-delete-modal").should("not.exist");
    // blog post view modal should be closed //
    cy.getByDataAttr("admin-view-modal").should("not.exist");
  });

  // logout //
  /*
  afterEach(() => {
    cy.getByDataAttr("dash_Main_Logout_Link").click();
  });
  */
});