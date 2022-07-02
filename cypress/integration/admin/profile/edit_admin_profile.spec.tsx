/// <reference types="cypress" />
import { expect } from "chai";
// type imports //
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/admins/dataTypes";
// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { interceptIndefinitely, loginAndOpenAdminProfile } from "../../../helpers/generalHelpers";

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
  before(() => {
    loginAndOpenAdminProfile({ email: readerAdmin.email, password: USER_PASSWORD });
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

  describe("Modal functionality, OPEN, CLOSE and errors", () => {
    it("Should properly trigger and display the <EditAdminProfile> modal", () => {
      const { firstName, lastName, email } = appState.authState.currentAdmin;
      cy.getByDataAttr("admin-profile-edit-btn").click()
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
      cy.getByDataAttr("admin-firstname-display").should("be.visible").contains(firstName);
      cy.getByDataAttr("admin-lastname-display").should("be.visible").contains(lastName);
      cy.getByDataAttr("admin-email-display").should("be.visible").contains(email);
    });
    it("Should properly trigger the Admin profile <First Name> input, properly display data and errors", () => {
      const { firstName } = appState.authState.currentAdmin;
      cy.getByDataAttr("edit-firstname-btn").click().should("not.exist");
      cy.getByDataAttr("edit-firstname-input").should("exist").then(($inputElem) => {
        expect($inputElem.find("input").val()).to.equal(firstName);
        // error message should not exists //
        expect($inputElem.find(".error").length).to.equal(0)
      });
    });
    it("Should properly trigger the Admin profile <Last Name> input, properly display data and errors", () => {
      const { lastName } = appState.authState.currentAdmin;
      cy.getByDataAttr("edit-lastname-btn").click().should("not.exist");
      cy.getByDataAttr("edit-lastname-input").should("exist").then(($inputElem) => {
        expect($inputElem.find("input").val()).to.equal(lastName);
        // error message should not exists //
        expect($inputElem.find(".error").length).to.equal(0)
      });
    });
    it("Should properly trigger the Admin profile <Email> input, properly display data and errors", () => {
      const { email } = appState.authState.currentAdmin;
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
    const adminIds: string[] = adminsArr.map((admin) => admin._id);
    cy.task("deleteAdminModels", adminIds);
  });

  

  /*
  describe("Admin editing profile, submitting blank data", () => {
  });
  */
})
