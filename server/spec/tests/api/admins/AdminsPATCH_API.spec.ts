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
import type { AdminData, CreateAdminRes, ErrorAdminRes } from "@/redux/_types/admins/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { generateMockAdminData } from "../../../hepers/testHelpers";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

// NOTES //
// Clients who are not logged in, Regular User clients - both READER and CONTRIBUTOR level should not have any access //
// An Admin client with <admin> access level should be able to edit their model only //
// An Admin client with <owner> access llevel should be able to edit any model //

describe("AdminsController:Edit PATCH API tests", function() {
  // custom timeout //
  this.timeout(10000);
  let server: Express;
  // model counts //
  let numberOfAdmins: number;
  // mock data //
  let mockAdminData: ReqAdminData;
  // user models //
  let adminUser: IAdmin;
  let ownerUser: IAdmin;
  let readerRegUser: IUser;
  let contributorRegUser: IUser;
  // login tokens //
  let adminJWTToken: string;
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
      adminUser = await Admin.findOne({ role: "admin" });
      ownerUser = await Admin.findOne({ role: "owner" });
      readerRegUser = await User.findOne({ userType: "READER" });
      contributorRegUser = await User.findOne({ userType: "CONTRIBUTOR" });
      //
      numberOfAdmins = await Admin.countDocuments();
      //
      mockAdminData = generateMockAdminData();
    } catch (error) {
      throw error;
    }
  });
  // login admins users //
  before(async () => {
    try {
      const { email: adminEmail } = adminUser;
      const { email: ownerEmail } = ownerUser;
      const { email: readerEmail } = readerRegUser;
      const { email: contributorEmail } = contributorRegUser;
      //
      ({ userJWTToken: adminJWTToken  } = await loginUser({ chai, email: adminEmail, server }));
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
    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .send({ adminData: mockAdminData })
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
    });
    describe("PATCH /api/admins/:admin_id - invalid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch("/api/admins/:admin_id")
          .send({ adminData: {} })
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
    });
  });
  // END CONTEXT client no Login //
  // Context User client READER - Logged in /
  context(("User Client - READER - Logged in"), function() {
    let regAdminId: string;
    before(() => {
      regAdminId = adminUser._id.toHexString();
    });
    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: mockAdminData })
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
    });
    describe("PATCH /api/admins/:admin_id - invalid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch("/api/admins/:admin_id")
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: {} })
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
    });
  });
  // END CONTEXT User client READER logged in //

  // CONTEXT User client CONTRIBUTOR logged in //
  context(("User Client - READER - Logged in"), function() {
    let regAdminId: string;
    before(() => {
      regAdminId = adminUser._id.toHexString();
    });
    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: mockAdminData })
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
    });
    describe("PATCH /api/admins/:admin_id - invalid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch("/api/admins/:admin_id")
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: {} })
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
    });
  });
  // END CONTEXT User client Contributor Logged in //
  
});