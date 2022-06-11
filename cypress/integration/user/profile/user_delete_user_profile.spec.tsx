/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { UserData } from "@/redux/_types/users/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";

describe("Users - /user/dashboard/profile - 'Delete User Profile' - Integration Tests", () => {
  // constants //
  const USER_PASSWORD: string = "password";
  let appState: IGeneralState;
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
    cy.visit("/login")
      .then(() => {
        cy.getByDataAttr("login-page-email-input").type(readerUser.email);
        cy.getByDataAttr("login-page-password-input").type(USER_PASSWORD);
        cy.getByDataAttr("login-page-login-btn").click();
        //
        cy.getByDataAttr("user-main-page").should("exist");
        cy.wait(5000)
        return cy.window().its("store").invoke("getState")
      })
      .then((state) => {
        appState = deepCopyObject<IGeneralState>(state);
        console.log(appState)
        return cy.visit("/user/dashboard/profile");
      })     
      .then(() => {
        cy.getByDataAttr("user-profile-main").should("be.visible");
      });        
  });

  describe("User attempting to delete their profile WITHOUT entering a password", () => {
        
    it("Should NOT delete the User Profile AND keep the <ConfirmDeleteModal> component open", () => {
      cy.getByDataAttr("user-profile-delete-btn").click().then(() => {
        return cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
      })
      .then(() => {
        return cy.getByDataAttr("confirm-profile-delete-modal-delete-btn").click();
      })
      .then(() =>  {
        return cy.getByDataAttr("confirm-profile-delete-modal").should("exist").and("be.visible");
      })
      .then(() => {
        cy.getByDataAttr("confirm-profile-delete-modal-pass-error").should("exist").and("be.visible");
      });
    });
  });

  after(() => {
    const userIds: string[] = usersArr.map((user) => user._id);
    cy.task("deleteUserModels", userIds);
  });
});
