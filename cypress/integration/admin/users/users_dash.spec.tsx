/// <reference types="cypress" />
/// <reference types="cypress-pipe" />

import { expect } from "chai";
// types 
import type { IUserState, IGeneralState } from "@/redux/_types/generalTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "@/components/_helpers/displayHelpers";


describe("Admin dashboard navigation tets", () => {
  const adminEmail: string = "owner@email.com";
  const adminPass: string = "password";
  //
  let usersState: IUserState;
  let appState: IGeneralState;

  // login and navigate to dash //

  beforeEach(() => {
    cy.intercept({ method: "GET", url: "/api/posts" }).as("getUsers");
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
    cy.wait("@getUsers");
    cy.visit("http://localhost:3000/admin/dashboard/users")
      .then(() => {
        cy.getByDataAttr("admin-users-page").should("exist");
        //
        cy.window().its("store").invoke("getState").its("authState").its("currentUser").should("not.be.null");
        cy.window().its("store").invoke("getState").its('usersState').its("usersArr").should("have.length.above", 0);
        cy.window().its("store").invoke("getState").then((state) => {
          appState = deepCopyObject(state);
        });
          
      });
  });

  it("Should correctly render all components at the <AdminUsers> page", () => {
    //
    cy.getByDataAttr("admin-users-page").should("be.visible");
    // assert correct state //
    cy.window().its("store").invoke("getState").its("usersState").its("usersArr").should("have.length.above", 0);
    cy.window().its("store").invoke("getState").then((state) => {
      // auth state should not change //
      expect(appState.authState).to.eql(state.authState);
      // blog posts state should update //
      usersState = { ...state.usersState };
      const { status, loading, selectedUserData, usersArr, error, errorMessages } = usersState;
      // check blogUserState updates //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(checkEmptyObjVals(selectedUserData)).to.equal(true);
      expect(usersArr.length).to.be.lte(100);
      expect(errorMessages).to.be.null;
      expect(error).to.be.null;
        //
    })
    .then(() => {
      const usersArrLength: number = usersState.usersArr.length;
      cy.getByDataAttr("user-data-row").should("have.length", usersArrLength);
    })
    .then(() => {
      const { usersArr } = usersState;
      cy.getByDataAttr("user-name-div").each((elem, index) => {
        expect(elem.html()).to.equal(usersArr[index].firstName);
      });
      cy.getByDataAttr("user-email-div").each((elem, index) => {
        expect(elem.html()).to.equal(usersArr[index].email);
      });
      cy.getByDataAttr("user-confirmed-div").each((elem, index) => {
        expect(elem.html()).to.equal(usersArr[index].confirmed);
      });
    })
    .then(() => {
      const usersLength = usersState.usersArr.length
      cy.getByDataAttr("user-view-btn").should("have.length",  usersLength);
    });
    // assert correct blog post card rendering //
  });

  it("Should correctly toggle the preview modal and open the queried <User> model", () => {
    cy.getByDataAttr("user-view-btn").first().click();
    // assert new state //
    cy.window().its("store").invoke("getState").its("usersState").its("selectedUserData").should("not.deep.equal", appState.usersState.selectedUserData);
    cy.window().its("store").invoke("getState").then((state) => {
      usersState = { ...state.usersState };
      const { status, loading, selectedUserData, usersArr, error, errorMessages } = usersState;
      // auth state should stay the same //
      expect(appState.authState).to.eql(state.authState);
      // check usersState updates //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(selectedUserData).to.eql(usersArr[0]);
      expect(usersArr.length).to.be.lte(100);
      expect(errorMessages).to.be.null;
      expect(error).to.be.null;
      //
    }).then(() => {
      // user view modal should be open //
      cy.getByDataAttr("user-view-modal").should("be.visible");
      // ensure all buttons are present //
      cy.getByDataAttr("user-modal-close-btn").should("be.visible").contains("Close");
      cy.getByDataAttr("user-modal-confirm-btn").should("be.visible").contains("Confirm");
      cy.getByDataAttr("user-modal-edit-btn").should("be.visible").contains("Edit");
      cy.getByDataAttr("user-modal-delete-btn").should("be.visible").contains("Delete");
    }).then(() => {
      const { firstName, lastName, email, confirmed } = usersState.selectedUserData;
      // ensure corect data rendered //
      cy.getByDataAttr("user-modal-first-name").contains("First Name: ").find("span").contains(firstName);
      cy.getByDataAttr("user-modal-last-name").contains("Last Name: ").find("span").contains(lastName);
      cy.getByDataAttr("user-modal-email").contains("Email: ").find("span").contains(email);
      cy.getByDataAttr("user-modal-confirmed").contains("Confirmed: ").find("span").contains(`${confirmed ? "Yes" : "No"}`);
  
    }).then(() => {
      cy.getByDataAttr("user-modal-close-btn").click();
      // modal should be closed //
      cy.getByDataAttr("user-view-modal").should("not.exist");
    });
  });

  
  it("Should correctly handle the <Delete> CANCEL functionality", () => {
    //
    cy.getByDataAttr("user-view-btn").first().click();
    cy.getByDataAttr("user-modal-delete-btn").click();
    // confirm delete should be open //
    cy.getByDataAttr("confirm-delete-modal").should("exist").and("have.length", 1)
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("exist").and("have.length", 1);
    cy.getByDataAttr("confirm-delete-modal-delete-btn").should("exist").and("have.length", 1);
    // should successfully cancel //
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").click();
    
    cy.window().its("store").invoke("getState").its("usersState").its("selectedUserData").should("not.deep.equal", appState.usersState.selectedUserData);
    cy.window().its("store").invoke("getState").then((state) => {
      expect(appState.authState).to.eql(state.authState);
    });
    // confirm delete modal should be closed //
    cy.getByDataAttr("confirm-delete-modal").should("not.exist");
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("not.exist");
    cy.getByDataAttr("confirm-delete-modal-cancel-btn").should("not.exist");

  });

  it("Should correctly handle the <Delete> CONFIRM DELETE functionality", () => {
    cy.getByDataAttr("user-view-btn").first().click();
    cy.getByDataAttr("usermodal-delete-btn").click();    
    // confirm delete should be open //
    cy.getByDataAttr("confirm-delete-modal").should("exist").and("have.length", 1)
    cy.getByDataAttr("confirm-delete-modal-delete-btn").should("exist").and("have.length", 1);
    // should successfully cancel //
    // redux auth state should stay the same //
    cy.getByDataAttr("confirm-delete-modal-delete-btn").click().then(() => {
      return cy.window().its("store").invoke("getState");
    })
    .then((state) => {
      const { status, loading, responseMsg, selectedUserData, usersArr, error, errorMessages } = state.usersState;
      // changed <BlogUsers> state //
      expect(status).to.equal(200);
      expect(loading).to.equal(false);
      expect(responseMsg).to.be.a("string");
      expect(checkEmptyObjVals(selectedUserData)).to.equal(true);
      expect(usersArr.length).to.equal(appState.usersState.usersArr.length - 1);
      expect(error).to.be.null;
      expect(errorMessages).to.be.null;
    });
    // confirm delete modal should be closed //
    cy.getByDataAttr("confirm-delete-modal").should("not.exist");
    // blog post view modal should be closed //
    cy.getByDataAttr("user-view-modal").should("not.exist");
  });

  // logout //
  /*
  afterEach(() => {
    cy.getByDataAttr("dash_Main_Logout_Link").click();
  });
  */
});