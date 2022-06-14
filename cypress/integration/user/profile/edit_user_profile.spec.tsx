/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { UserData } from "@/redux/_types/users/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { interceptIndefinitely, loginAndOpenUserProfile } from "../../../helpers/generalHelpers";

describe("Users - /user/dashboard/profile - 'Delete User Profile' - Integration Tests", () => {
  // constants //
  const USER_PASSWORD: string = "password";
  let appState: IGeneralState; let authState: IAuthState;
  let usersArr: UserData[];  let readerUser: UserData;

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ users: UserData[] }>("seedUsers", { number: 1, role: "reader" });
        })
        .then(({ users }) => {
          usersArr = [ ...users ];
          readerUser = users[0];
        });
    } catch (error) {
      throw error;
    }
  });
  before(() => {
    loginAndOpenUserProfile({ email: readerUser.email, password: USER_PASSWORD });
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

  describe("Modal functionality, OPEN, CLOSE and errors", () => {
    it("Should properly trigger and display the <EditUserProfile> modal", () => {
      cy.getByDataAttr("user-profile-edit-btn").click()
        .getByDataAttr("edit-profile-modal").should("exist").and("be.visible").then(($editProfileModal) => {
          // input should not be activated //
          expect($editProfileModal.find("input").length).to.equal(0);
        })
    })
  });

  after(() => {
    console.log("running cleanup")
    const userIds: string[] = usersArr.map((user) => user._id);
    cy.task("deleteUserModels", userIds);
  });

  

  /*
  describe("User editing profile, submitting blank data", () => {
  });
  */
})
