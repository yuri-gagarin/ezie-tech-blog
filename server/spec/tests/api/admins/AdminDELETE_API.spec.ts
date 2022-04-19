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
import type { AdminData, DeleteAdminRes } from "@/redux/_types/admins/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

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
  // NO LOGIN //
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
    let adminId: string;

    before(() => {
      adminId = adminUser._id.toHexString();
    });
    describe("DELETE /api/admins/:admin_id", function() {
      it("Should NOT delete an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${adminId}`)
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
          const queriedAdmin: IAdmin | null = await Admin.findOne({ id: adminId });
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

  // CONTEXT Admin client logged in ADMIN level  //
  context(("Admin Client - Logged in - <admin> level Admin"), function() {
    let regAdminId: string;
    let otherRegAdminId: string;

    before(() => {
      regAdminId = adminUser._id.toHexString();
      otherRegAdminId = otherAdminUser._id.toHexString();
    });

    describe("DELETE /api/admins/:admin_id - OTHER Admin's MODEL", function() {
      it("Should NOT delete an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${otherRegAdminId}`)
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, deletedAdmin, error, errorMessages } = body as DeleteAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            // 
            expect(deletedAdmin).to.be.undefined;
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

    describe("DELETE /api/admins/:admin_id - OWN Admin's MODEL", function() {
      it("Should correctly delete OWN Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, deletedAdmin, error, errorMessages } = body as DeleteAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedAdmin).to.be.an("object");
            // 
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should DECREMENT the number of <Admin> models in the database by 1", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins - 1);
          //
          numberOfAdmins = updatedNumOfAdmins;
        } catch (error) { 
          throw error;
        }
      });
      it("Should removed the queried <Admin> model from the database", async () => {
        try {
          const queriedAdmin: IAdmin | null = await Admin.findOne({ _id: regAdminId });
          //
          expect(queriedAdmin).to.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Admin client logged in ADMIN level //

  // CONTEXT Admin client logged in OWNER level //
  context(("Admin Client - Logged in - <owner> level Admin"), function() {
    let ownerAdminId: string;
    let otherRegAdminId: string;

    before(() => {
      ownerAdminId = ownerUser._id.toHexString();
      otherRegAdminId = otherAdminUser._id.toHexString();
    });

    describe("DELETE /api/admins/:admin_id - OTHER Admin's MODEL", function() {
      it("Should correctly delete OTHER Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${otherRegAdminId}`)
          .set({ Authorization: ownerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, deletedAdmin, error, errorMessages } = body as DeleteAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedAdmin).to.be.an("object");
            // 
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should DECREMENT the number of <Admin> models in the database by 1", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins - 1);
          //
          numberOfAdmins = updatedNumOfAdmins;
        } catch (error) { 
          throw error;
        }
      });
      it("Should remove the queried <Admin> model from the database", async () => {
        try {
          const queriedAdmin: IAdmin | null = await Admin.findOne({ _id: otherRegAdminId });
          //
          expect(queriedAdmin).to.be.null;
        } catch (error) {
          throw error;
        }
      });
    });

    describe("DELETE /api/admins/:admin_id - OWN Admin's MODEL", function() {
      it("Should correctly delete OWN Admin model and send back a correct response", (done) => {
        chai.request(server)
          .delete(`/api/admins/${ownerAdminId}`)
          .set({ Authorization: ownerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, deletedAdmin, error, errorMessages } = body as DeleteAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedAdmin).to.be.an("object");
            // 
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should DECREMENT the number of <Admin> models in the database by 1", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins - 1);
          //
          numberOfAdmins = updatedNumOfAdmins;
        } catch (error) { 
          throw error;
        }
      });
      it("Should removed the queried <Admin> model from the database", async () => {
        try {
          const queriedAdmin: IAdmin | null = await Admin.findOne({ _id: ownerAdminId });
          //
          expect(queriedAdmin).to.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Admin client logged in ADMIN level //

  after(async () => {
    try {
      await Admin.deleteMany();
      await User.deleteMany();
    } catch (error) {
      throw error;
    }
  })
});