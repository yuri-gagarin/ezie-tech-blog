/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/admins/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { interceptIndefinitely } from "../../../helpers/generalHelpers";
// helpres //
const openAdminProfilePage = (cy: Cypress.cy, { email, password }: { email: string; password: string; }) => {
  cy.visit("/login")
  cy.getByDataAttr("login-page-email-input").type(email);
  cy.getByDataAttr("login-page-password-input").type(password);
  cy.getByDataAttr("login-page-login-btn").click();
  //
  cy.getByDataAttr("admin-main-page").should("exist");
  cy.wait(5000);
};

describe("Admins - /admin/dashboard/profile - 'Delete Admin Profile' - Integration Tests", () => {
  // constants //
  const USER_PASSWORD: string = "password";
  let appState: IGeneralState; let authState: IAuthState;
  let adminsArr: AdminData[];  let readerAdmin: AdminData;

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "reader" });
        })
        .then(({ admins }) => {
          adminsArr = [ ...admins ];
          readerAdmin = admins[0];
        });
    } catch (error) {
      throw error;
    }
  });

  /*
  beforeEach(() => {
    cy.intercept({ method: "DELETE", url: "/api/delete_admin_profile" }).as("deleteProfileRequest");
  });
  */

  describe("Admin attempting to delete their profile WITHOUT entering a password", () => {
    before(() => {
      openAdminProfilePage(cy, { email: readerAdmin.email, password: USER_PASSWORD });
    });
    before(() => {
      cy.window().its("store").invoke("getState").then((state) =>  {
        appState = deepCopyObject<IGeneralState>(state);
        cy.getByDataAttr("admin-menu-profile-link").click().then(($linkBtn) => {
          expect($linkBtn.hasClass("active")).to.equal(true);
          cy.getByDataAttr("admin-profile-main").should("be.visible");
        });
      })
    });
        
    it("Should NOT delete the Admin Profile AND keep the <ConfirmDeleteModal> component open, should NOT Change REDUX AuthState", () => {
      cy.getByDataAttr("admin-profile-delete-btn").click().then(() => {
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

  describe("Admin attempting to delete their profile WITHOUT entering a password OR a WRONG password ", () => {
    before(() => {
      openAdminProfilePage(cy, { email: readerAdmin.email, password: USER_PASSWORD });
    });
    before(() => {
      cy.window().its("store").invoke("getState").then((state) =>  {
        appState = deepCopyObject<IGeneralState>(state);
        cy.getByDataAttr("admin-menu-profile-link").click().then(($linkBtn) => {
          expect($linkBtn.hasClass("active")).to.equal(true);
          cy.getByDataAttr("admin-profile-main").should("be.visible");
        });
      })
    });
    it("Should NOT delete the Admin Profile AND keep the <ConfirmDeleteModal> component open", () => {
      const wrongPass = "wrongpass";
      cy.getByDataAttr("admin-profile-delete-btn").click();
      cy.getByDataAttr("del-admin-profile-pass-field").find("input").focus().type(wrongPass).then(($input) => {
        expect($input.val()).to.equal(wrongPass);
        cy.wrap($input).clear();
      })
      // error should pop up //
      cy.getByDataAttr("del-admin-profile-pass-field").find(".error").should("exist").and("be.visible");
      // if <ConfirmDelete> clicked //
      cy.window().its("store").invoke("getState").its("authState").should("deep.equal", appState.authState);
    });

    it("Should NOT delete the Admin Profile with an INCORRECT Password and show relevant error", () => {
      const wrongPass = "wrongpass";
      const deleteProfileInterception = interceptIndefinitely("/api/delete_admin_profile");
      //
      cy.getByDataAttr("del-admin-profile-pass-field").find("input").focus().type(wrongPass).then(($input) => {
        expect($input.val()).to.equal(wrongPass);
      });
      // should be no error in form field //
      cy.getByDataAttr("del-admin-profile-pass-field").find(".error").should("not.exist");
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
      // assert admins is still logged in AND delete profile modal open //
      cy.window().its("store").invoke("getState").its("authState").then((authState) => {
        expect(authState.currentAdmin).to.be.an("object");
        expect(authState.loggedIn).to.equal(true);
        expect(authState.error).to.be.an("object");
        expect(authState.errorMessages).to.be.an("array");
      });
      cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
    });
  });
  
  describe("Admin attempting to delete their profile WITH a CORRECT password", () => {
    before(() => {
      openAdminProfilePage(cy, { email: readerAdmin.email, password: USER_PASSWORD });
    });
    before(() => {
      cy.window().its("store").invoke("getState").then((state) =>  {
        appState = deepCopyObject<IGeneralState>(state);
        cy.getByDataAttr("admin-menu-profile-link").click().then(($linkBtn) => {
          expect($linkBtn.hasClass("active")).to.equal(true);
          cy.getByDataAttr("admin-profile-main").should("be.visible");
        });
      })
    });
  
    it("Should correctly delete the Admin Profile ", () => {
      const correctPassword = "password";
      const deleteProfileInterception = interceptIndefinitely("/api/delete_admin_profile");
      cy.getByDataAttr("admin-profile-delete-btn").click();
      cy.getByDataAttr("del-admin-profile-pass-field").find("input").focus().type(correctPassword);
      cy.getByDataAttr("confirm-profile-delete-modal-delete-btn")
        .click()
        .window().its("store").invoke("getState").its("authState").its("loading").should("be.true")
        .getByDataAttr("gen-loader-loading-msg").should("exist").and("be.visible")
        .then(() => {
          deleteProfileInterception.sendResponse();
      });
      cy.getByDataAttr("admin-profile-main").should("not.exist");
      cy.getByDataAttr("login-page").should("exist").and("be.visible");
      // check cookies and REDUX state changes //
      cy.getCookie("jwtToken").should("be.null");
      cy.window().its("store").invoke("getState").its("authState").then((authState) => {
        const { loading, loggedIn, loggedInAt, currentAdmin, isAdmin, firebaseData, authToken, error, errorMessages } = authState;
        expect(loading).to.equal(false);
        expect(loggedIn).to.equal(false);
        expect(loggedInAt).to.be.null;
        expect(currentAdmin).to.be.null;
        expect(isAdmin).to.equal(false);
        expect(firebaseData).to.be.null;
        expect(authToken).to.equal("");
        expect(error).to.be.null;
        expect(errorMessages).to.be.null;
      });
    });
  });
  
  after(() => {
    console.log("running cleanup")
    const adminIds: string[] = adminsArr.map((admin) => admin._id);
    cy.task("deleteAdminModels", adminIds);
  });
});
