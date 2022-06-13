/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { UserData } from "@/redux/_types/users/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { interceptIndefinitely } from "../../../helpers/generalHelpers";
// helpres //
const openUserProfilePage = (cy: Cypress.cy, { email, password }: { email: string; password: string; }) => {
  cy.visit("/login")
  cy.getByDataAttr("login-page-email-input").type(email);
  cy.getByDataAttr("login-page-password-input").type(password);
  cy.getByDataAttr("login-page-login-btn").click();
  //
  cy.getByDataAttr("user-main-page").should("exist");
  cy.wait(5000);
};

describe("Users - /user/dashboard/profile - 'Delete User Profile' - Integration Tests", () => {
  // constants //
  const USER_PASSWORD: string = "password";
  let appState: IGeneralState; let authState: IAuthState;
  let usersArr: UserData[];  let readerUser: UserData;

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ users: UserData[] }>("seedUsers", { number: 5, role: "reader" });
        })
        .then(({ users }) => {
          usersArr = [ ...users ];
          readerUser = users[0];
        });
    } catch (error) {
      throw error;
    }
  });

  beforeEach(() => {
    cy.intercept({ method: "DELETE", url: "/api/delete_user_profile" }).as("deleteProfileRequest");
  });

  /*
  describe("User attempting to delete their profile WITHOUT entering a password", () => {
    before(() => {
      openUserProfilePage(cy, { email: readerUser.email, password: USER_PASSWORD });
    });
    before(() => {
      cy.window().its("store").invoke("getState").then((state) =>  {
        appState = deepCopyObject<IGeneralState>(state);
        cy.getByDataAttr("user-menu-profile-link").click().then(($linkBtn) => {
          expect($linkBtn.hasClass("active")).to.equal(true);
          cy.getByDataAttr("user-profile-main").should("be.visible");
        });
      })
    });
        
    it("Should NOT delete the User Profile AND keep the <ConfirmDeleteModal> component open, should NOT Change REDUX AuthState", () => {
      cy.getByDataAttr("user-profile-delete-btn").click().then(() => {
        cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
      });
     
      // click the delete confirm btn, without entered password //
      cy.getByDataAttr("confirm-profile-delete-modal-delete-btn").click().then(() =>  {
        return cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
      })
      .then(() => {
        cy.getByDataAttr("confirm-profile-delete-modal-pass-error").should("exist").and("be.visible");
        cy.window().its("store").invoke("getState").its("authState").should("deep.equal", appState.authState);
      });
    });
    it("Should be dismissable without altering REDUX State, should NOT close the <ConfirmDeleteModal> component", () => {
      cy.getByDataAttr("confirm-profile-delete-modal-pass-error").children(".close").click()
        .then(() => {
          cy.getByDataAttr("confirm-profile-delete-modal-pass-error").should("not.exist");
          cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
          // assert that redux state did not change //
          cy.window().its("store").invoke("getState").its("authState").should("deep.equal", appState.authState);
        });
    });
  });
  */

  describe("User attempting to delete their profile WITHOUT entering a password OR a WRONG password ", () => {
    before(() => {
      openUserProfilePage(cy, { email: readerUser.email, password: USER_PASSWORD });
    });
    before(() => {
      cy.window().its("store").invoke("getState").then((state) =>  {
        appState = deepCopyObject<IGeneralState>(state);
        cy.getByDataAttr("user-menu-profile-link").click().then(($linkBtn) => {
          expect($linkBtn.hasClass("active")).to.equal(true);
          cy.getByDataAttr("user-profile-main").should("be.visible");
        });
      })
    });
    it("Should NOT delete the User Profile AND keep the <ConfirmDeleteModal> component open", () => {
      const wrongPass = "wrongpass";
      cy.getByDataAttr("user-profile-delete-btn").click();
      cy.getByDataAttr("del-user-profile-pass-field").find("input").focus().type(wrongPass).then(($input) => {
        expect($input.val()).to.equal(wrongPass);
        cy.wrap($input).clear();
      })
      // error should pop up //
      cy.getByDataAttr("del-user-profile-pass-field").find(".error").should("exist").and("be.visible");
      // if <ConfirmDelete> clicked //
      cy.window().its("store").invoke("getState").its("authState").should("deep.equal", appState.authState);
    });

    it("Should NOT delete the User Profile with an INCORRECT Password and show relevant error", () => {
      const wrongPass = "wrongpass";
      const deleteProfileInterception = interceptIndefinitely("/api/delete_user_profile");
      //
      cy.getByDataAttr("del-user-profile-pass-field").find("input").focus().type(wrongPass).then(($input) => {
        expect($input.val()).to.equal(wrongPass);
      });
      // should be no error in form field //
      cy.getByDataAttr("del-user-profile-pass-field").find(".error").should("not.exist");
      cy.getByDataAttr("confirm-profile-delete-modal-delete-btn")
        .click()
        .window().its("store").invoke("getState").its("authState").its("loading").should("be.true")
        .getByDataAttr("gen-loader-loading-msg").should("exist").and("be.visible")
        .then(() => {
          deleteProfileInterception.sendResponse();
      });
      // assert error shown //
      cy.getByDataAttr("gen-loader-loading-msg").should("not.exist")
      cy.window().its("store").invoke("getState").its("authState").its("loading").should("be.false");
      // assert users is still logged in AND delete profile modal open //
      cy.window().its("store").invoke("getState").its("authState").then((authState) => {
        expect(authState.currentUser).to.be.an("object");
        expect(authState.loggedIn).to.equal(true);
        expect(authState.error).to.be.an("object");
        expect(authState.errorMessages).to.be.an("array");
      });
      cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
    });
  
  });
  after(() => {
    const userIds: string[] = usersArr.map((user) => user._id);
    cy.task("deleteUserModels", userIds);
  });
});
