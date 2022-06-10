/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { UserData } from "@/redux/_types/users/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";

describe("Users - /user/dashboard/profile - 'Delete User Profile' - Integration Tests", () => {
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
        cy.getByDataAttr("login-page-password-input").type("password");
        cy.getByDataAttr("login-page-login-btn").click();
        //
        cy.getByDataAttr("user-main-page").should("exist");
        cy.wait(5000)
        return cy.window().its("store").invoke("getState")
      })
      .then((state) => {
        appState = deepCopyObject<IGeneralState>(state);
        return cy.visit("/user/dashboard/profile");
      })     
      .then(() => {
        cy.getByDataAttr("user-profile-main").should("be.visible");
      });        
  });

  after(() => {
    const userIds: string[] = usersArr.map((user) => user._id);
    cy.task("deleteUserModels", userIds);
  });
});
