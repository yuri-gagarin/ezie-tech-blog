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

// At the moment only an Admin with <Admin.role> === "owner" should be able to create another Admin model //

describe("AdminsController:Create POST API tests", function() {
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
  /*
  context(("Guest Client - NOT Logged in"), function() {
    describe("POST /api/admins - valid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
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
    describe("POST /api/admins - invalid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
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
  // Context User client - Logged in /
  context(("User Client - READER -  Logged in"), function() {
    describe("POST /api/admins - valid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: mockAdminData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
    describe("POST /api/admins - invalid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
  context(("User Client - CONTRIBUTOR -  Logged in"), function() {
    describe("POST /api/admins - valid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: contributorUserJWTToken })
          .send({ adminData: mockAdminData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
    describe("POST /api/admins - invalid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: readerUserJWTToken })
          .send({ adminData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
  // CONTEXT Admin client ADMIN LEVEL <Admin> logged in //
  context(("Admin Client - level 'Admin' -  Logged in"), function() {
    describe("POST /api/admins - valid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: adminJWTToken })
          .send({ adminData: mockAdminData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
    describe("POST /api/admins - invalid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: adminJWTToken })
          .send({ adminData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
  */
  // END CONTEXT Admin client ADMIN LEVEL <Admin> logged in //
  // CONTEXT Admin client ADMIN LEVEL <Owner> logged in //
  context(("Admin Client - level 'Owner' -  Logged in"), function() {
    let _createdAdmin: AdminData;
    describe("POST /api/admins - valid data - default response", function() {
      it("Should correctly create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: ownerJWTToken })
          .send({ adminData: mockAdminData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, createdAdmin } = body as CreateAdminRes;
            console.log(response.body)
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(createdAdmin).to.be.an("object");
            //
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            //
            _createdAdmin = createdAdmin;
            done();
          });
      });
      it("Should correctly set all the relevant field on a new <Admin> model", () => {
        expect(_createdAdmin._id).to.be.a("string");
        expect(_createdAdmin.firstName).to.be.a("string");
        expect(_createdAdmin.lastName).to.be.a("string");
        expect(_createdAdmin.email).to.equal(mockAdminData.email);
        expect(_createdAdmin.role).to.equal("admin");
        expect(_createdAdmin.confirmed).to.equal(true);
        expect(_createdAdmin.editedAt).to.be.a("string");
        expect(_createdAdmin.createdAt).to.be.a("string");
        // password info should not be sent back //
        expect(_createdAdmin.password).to.be.undefined;
      });
      it("Should INCREMENT the number of <Admin> models in the database by 1", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins + 1);
          //
          numberOfAdmins = updatedNumOfAdmins;
        } catch (error) { 
          throw error;
        }
      });
    });
    /*
    describe("POST /api/admins - invalid data - default response", function() {
      it("Should NOT create a NEW Admin model and send back a correct response", (done) => {
        chai.request(server)
          .post("/api/admins")
          .set({ Authorization: adminJWTToken })
          .send({ adminData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
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
    */
  });
  // END CONTEXT Admin client ADMIN LEVEL <Admin> logged in //
});