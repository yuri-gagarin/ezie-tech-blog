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
      const { firstName, lastName, email } = appState.authState.currentUser;
      cy.getByDataAttr("user-profile-edit-btn").click()
        .getByDataAttr("edit-profile-modal").should("exist").and("be.visible").then(($editProfileModal) => {
          // modal control buttons should be visible //
          expect($editProfileModal.find(".buttons").length).to.equal(2);
          // cancel button //
          expect($editProfileModal.find(".buttons").first().find(".button").text()).to.equal("Cancel Changes");
          // update and delete buttons //
          expect($editProfileModal.find(".buttons").last().find(".button").first().text()).to.equal("Update All");
          expect($editProfileModal.find(".buttons").last().find(".button").last().text()).to.equal("Delete Profile");
          // input should not be activated //
          expect($editProfileModal.find("input").length).to.equal(0);
        });
      cy.getByDataAttr("user-firstname-display").should("be.visible").contains(firstName);
      cy.getByDataAttr("user-lastname-display").should("be.visible").contains(lastName);
      cy.getByDataAttr("user-email-display").should("be.visible").contains(email);
    });
    it("Should properly trigger the User profile <First Name> input, properly display data and errors", () => {
      const { firstName } = appState.authState.currentUser;
      cy.getByDataAttr("edit-firstname-btn").click().should("not.exist");
      cy.getByDataAttr("edit-firstname-input").should("exist").then(($inputElem) => {
        expect($inputElem.find("input").val()).to.equal(firstName);
        // error message should not exists //
        expect($inputElem.find(".error").length).to.equal(0)
      });
    });
    it("Should properly trigger the User profile <Last Name> input, properly display data and errors", () => {
      const { lastName } = appState.authState.currentUser;
      cy.getByDataAttr("edit-lastname-btn").click().should("not.exist");
      cy.getByDataAttr("edit-lastname-input").should("exist").then(($inputElem) => {
        expect($inputElem.find("input").val()).to.equal(lastName);
        // error message should not exists //
        expect($inputElem.find(".error").length).to.equal(0)
      });
    });
    it("Should properly trigger the User profile <Email> input, properly display data and errors", () => {
      const { email } = appState.authState.currentUser;
      cy.getByDataAttr("edit-email-btn").click().should("not.exist");
      cy.getByDataAttr("edit-email-input").should("exist").then(($inputElem) => {
        expect($inputElem.find("input").val()).to.equal(email);
        // error message should not exists //
        expect($inputElem.find(".error").length).to.equal(0)
      });
    });
    
    
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
