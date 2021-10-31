import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
//
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { ReqAdminData } from "@/server/src/_types/admins/adminTypes";
import type { AdminData, CreateAdminRes, EditAdminRes, ErrorAdminRes } from "@/redux/_types/admins/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { generateMockAdminData } from "../../../hepers/testHelpers";
import { loginUser } from "../../../hepers/testHelpers";
import { exec } from "child_process";

chai.use(chaiHTTP);

// NOTES //
// A Guest client, or regular User client both READER and CONTRIBUTOR should NOT have any access //
// Logged in Admin with <admin> role should ONLY be able to delete their OWN model //
// Logged in Admin with <owner> role should ONLY be able to delete their ANY model //
// 
describe("AdminsController:Delete DELETE API tests", function() {
  // custom timeout //
  this.timeout(10000);
  let server: Express;
  // model counts //
  let numberOfAdmins: number;
  // user models //
  let adminUser: IAdmin;
  let otherAdminUser: IAdmin;
  let ownerUser: IAdmin;
  let readerRegUser: IUser;
  let contributorRegUser: IUser;
  // login tokens //
  let adminJWTToken: string;
  let otherAdminJWTToken: string;
  let ownerJWTToken: string;
  let readerUserJWTToken: string;
  let contributorUserJWTToken: string;

  before(() => {
    server = ServerInstance.getExpressServer();
  });

  before(async () => {
    try {
      await generateMockAdmins(10, "admin");
      // generate owner level admin //
      await generateMockAdmins(1, "owner");
      await generateMockUsers({ number: 1, type: "READER" });
      await generateMockUsers({ number: 1, type: "CONTRIBUTOR" });
      // adminUser //
      ([ adminUser, otherAdminUser ] = await Admin.find({ role: "admin" }).limit(2));
      //
      ownerUser = await Admin.findOne({ role: "owner" });
      //
      readerRegUser = await User.findOne({ userType: "READER" });
      contributorRegUser = await User.findOne({ userType: "CONTRIBUTOR" });
      //
      numberOfAdmins = await Admin.countDocuments();
      //
    } catch (error) {
      throw error;
    }
  });

  // login admins users //
  before(async () => {
    try {
      const { email: adminEmail } = adminUser;
      const { email: otherAdminEmail } = otherAdminUser;
      const { email: ownerEmail } = ownerUser;
      const { email: readerEmail } = readerRegUser;
      const { email: contributorEmail } = contributorRegUser;
      //
      ({ userJWTToken: adminJWTToken  } = await loginUser({ chai, email: adminEmail, server }));
      ({ userJWTToken: otherAdminJWTToken } = await loginUser({ chai, email: otherAdminEmail, server }));
      ({ userJWTToken: ownerJWTToken  } = await loginUser({ chai, email: ownerEmail, server }));
      ({ userJWTToken: readerUserJWTToken  } = await loginUser({ chai, email: readerEmail, server }));
      ({ userJWTToken: contributorUserJWTToken  } = await loginUser({ chai, email: contributorEmail, server }));
    } catch (error) {
      throw (error);
    }
  });
  // CONTEXT client no Login //
  context(("Guest Client - NOT Logged in"), function() {
    let regAdminId: string;
    before(() => {
      regAdminId = adminUser._id.toHexString();
    });
    describe("DELETE /api/admins/:admin_id", function() {
      it("Should NOT delete an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${regAdminId}`)
          .end((err, response) => {
            if (err) done(err);
            // this should be a default response from Passport middleware for now //
            expect(response.status).to.equal(401);
            done();
          });
      });
      it("Should NOT alter the number of <Admin> models in the database", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
        } catch (error) { 
          throw error;
        }
      });
      it("Should NOT remove NOR alter the queried <Admin> model", async () => {
        try {
          const queriedAdmin: IAdmin | null = await Admin.findOne({ id: regAdminId });
          //
          expect(queriedAdmin).to.not.be.null;
          expect(queriedAdmin).to.eql(adminUser);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT client no Login //

  // CONTEXT User client logged in READER //
  context(("User Client - Logged in - READER User"), function() {
    let regAdminId: string;
    before(() => {
      regAdminId = adminUser._id.toHexString();
    });
    describe("DELETE /api/admins/:admin_id", function() {
      it("Should NOT delete an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${regAdminId}`)
          .set({ Authorization: readerUserJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this should be a default response from Passport middleware for now //
            expect(response.status).to.equal(401);
            done();
          });
      });
      it("Should NOT alter the number of <Admin> models in the database", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
        } catch (error) { 
          throw error;
        }
      });
      it("Should NOT remove NOR alter the queried <Admin> model", async () => {
        try {
          const queriedAdmin: IAdmin | null = await Admin.findOne({ id: regAdminId });
          //
          expect(queriedAdmin).to.not.be.null;
          expect(queriedAdmin).to.eql(adminUser);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT User client logged in READER //

  // CONTEXT User client logged in CONTRIBUTOR //
  context(("User Client - Logged in - CONTRIBUTOR User"), function() {
    let regAdminId: string;
    before(() => {
      regAdminId = adminUser._id.toHexString();
    });
    describe("DELETE /api/admins/:admin_id", function() {
      it("Should NOT delete an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${regAdminId}`)
          .set({ Authorization: contributorUserJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this should be a default response from Passport middleware for now //
            expect(response.status).to.equal(401);
            done();
          });
      });
      it("Should NOT alter the number of <Admin> models in the database", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
        } catch (error) { 
          throw error;
        }
      });
      it("Should NOT remove NOR alter the queried <Admin> model", async () => {
        try {
          const queriedAdmin: IAdmin | null = await Admin.findOne({ id: regAdminId });
          //
          expect(queriedAdmin).to.not.be.null;
          expect(queriedAdmin).to.eql(adminUser);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT client no Login //

});