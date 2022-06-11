/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { UserData } from "@/redux/_types/users/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";

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
      cy.getByDataAttr("user-profile-delete-btn").click();
      cy.getByDataAttr("confirm-profile-delete-modal")
        .should("exist").and("be.visible");
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
        });
    });
  });

  after(() => {
    const userIds: string[] = usersArr.map((user) => user._id);
    cy.task("deleteUserModels", userIds);
  });
});
