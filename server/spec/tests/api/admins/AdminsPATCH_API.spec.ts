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
  // password change for tests //
  const newAdminPassword = "newAdminPassword";

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
    let mockAdminData: ReqAdminData;
    before(() => {
      regAdminId = adminUser._id.toHexString();
      mockAdminData = generateMockAdminData();
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
    let mockAdminData: ReqAdminData;
    before(() => {
      regAdminId = adminUser._id.toHexString();
      mockAdminData = generateMockAdminData();
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
  context(("User Client - CONTRIBUTOR - Logged in"), function() {
    let regAdminId: string;
    let mockAdminData: ReqAdminData;

    before(() => {
      regAdminId = adminUser._id.toHexString();
      mockAdminData = generateMockAdminData();
    });

    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: contributorUserJWTToken })
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
  
  // CONTEXT Admin logged in, admin level - editing other Admins account //
  context(("Admin Client - ADMIN LEVEL - Logged in"), function() {
    let ownerAdminId: string;
    let mockAdminData: ReqAdminData;

    before(() => {
      ownerAdminId = ownerUser._id.toHexString();
      mockAdminData = generateMockAdminData();
    });
    
    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      it("Should NOT update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerAdminId}`)
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
          .patch(`/api/admins/${ownerAdminId}`)
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
  
  // END Admin logged in editing other Admins account //
  // CONTEXT Admin logged in, admin level - editing OWN account //
  context(("Admin Client - ADMIN LEVEL - Logged in - OWN Account"), function() {
    let regAdminId: string;
    let mockAdminData: ReqAdminData;
    let _editedAdmin: AdminData;

    before(() => {
      regAdminId = adminUser._id.toHexString();
      mockAdminData = generateMockAdminData();
    });

    describe("PATCH /api/admins/:admin_id - invalid data - default response", function() {
      
      it("Should NOT update an EXISTING Admin model witn an EMPTY <email> field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: { ...mockAdminData, email: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update an EXISTING Admin model witn an INVALID <email> field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: { ...mockAdminData, email: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update an EXISTING Admin model witn an existing <email> field TYPE and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: { ...mockAdminData, email: readerRegUser.email } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update an EXISTING Admin model if <admin> level Admin is changing the <role> field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: { ...mockAdminData, role: "owner" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update and change PASSWORD without a <newPassword> field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "", confirmNewPassword: "newpassword", oldPassword: "password" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      }); 
      it("Should NOT update and change PASSWORD without a <confirmNewPassword> field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "newPassword", confirmNewPassword: "", oldPassword: "password" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });           
      it("Should NOT update and change PASSWORD without a <oldPassword> field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "newPassword", confirmNewPassword: "newPassword", oldPassword: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      }); 
      it("Should NOT update and change PASSWORD with mismatching <newPassword> and <confirmNewPassword> fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "newPassword", confirmNewPassword: "newPassword1", oldPassword: "password" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update and change PASSWORD with an INCORRECT <oldPassword> field and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "newPassword", confirmNewPassword: "newPassword", oldPassword: "definitelynotcorrect" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
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
      it("Should NOT alter the queried <Admin> model in any way", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: regAdminId });
          expect(queriedAdminModel).to.eql(adminUser);
        } catch (error) {
          throw error;
        }
      });
    });
    
    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      it("Should correctly change the password when applicable changing only the password field", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { oldPassword: "password", newPassword: newAdminPassword, confirmNewPassword: newAdminPassword } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedAdmin } = body as EditAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedAdmin).to.be.an("object");
            //
            expect(editedAdmin._id).to.equal(adminUser._id.toHexString());
            expect(editedAdmin.firstName).to.equal(adminUser.firstName);
            expect(editedAdmin.lastName).to.equal(adminUser.lastName);
            expect(editedAdmin.email).to.equal(adminUser.email);
            expect(editedAdmin.editedAt).to.be.a("string");
            expect(editedAdmin.createdAt).to.be.a("string");
            // password should not be sent back, <Admin.role> should not change, <Admin.confirmer> should not change>
            expect(editedAdmin.role).to.equal("admin");
            expect(editedAdmin.confirmed).to.equal(adminUser.confirmed);
            //
            expect(body.error).to.be.undefined;
            expect(body.errorMessages).to.be.undefined;
            //
            _editedAdmin = editedAdmin;
            done();
          });
      });
      
      it("Should update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${regAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: mockAdminData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedAdmin } = body as EditAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedAdmin).to.be.an("object");
            //
            expect(body.error).to.be.undefined;
            expect(body.errorMessages).to.be.undefined;
            //
            _editedAdmin = editedAdmin;
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
      it("Should correctly edit the queried <Admin> model", async () => {
        try {
          expect(_editedAdmin._id).to.equal(adminUser._id.toHexString());
          expect(_editedAdmin.firstName).to.equal(mockAdminData.firstName);
          expect(_editedAdmin.lastName).to.equal(mockAdminData.lastName);
          expect(_editedAdmin.email).to.equal(mockAdminData.email);
          expect(_editedAdmin.editedAt).to.be.a("string");
          expect(_editedAdmin.createdAt).to.be.a("string");
          // password should not be sent back, <Admin.role> should not change, <Admin.confirmer> should not change>
          expect(_editedAdmin.role).to.equal("admin");
          expect(_editedAdmin.confirmed).to.equal(adminUser.confirmed);
          expect(_editedAdmin.password).to.be.undefined;
          // set the new edited admin model //
          adminUser = await Admin.findOne({ _id: regAdminId });
        } catch (error) {
          throw error;
        }
      });
    });
    
  });
  // END Admin logged in editing own Admin account //

  // Admin logged in editing other admins account //
  context(("Admin Client - ADMIN LEVEL - Logged in - OTHER Admins Account"), function() {
    let ownerAdminId: string;

    before(() => {
      ownerAdminId = ownerUser._id.toHexString();
    });

    describe("PATCH /api/admins/:admin_id - invalid data - default response", function() {
      
      it("Should NOT update an EXISTING Admin model witn INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: { } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update and change PASSWORD with INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
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
      it("Should NOT alter the queried <Admin> model in any way", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: ownerAdminId });
          expect(queriedAdminModel).to.eql(ownerUser);
        } catch (error) {
          throw error;
        }
      });
    });
    
    describe("PATCH /api/admins/:admin_id - valid data - default response", function() {
      let newMockData: ReqAdminData;

      before(() => {
        newMockData = generateMockAdminData();
      });

      it("Should NOT update an EXISTING Admin model witn INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ adminData: newMockData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update and change PASSWORD with INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerAdminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "newpassword", confirmNewPassword: "newpassword", oldPassword: "password" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
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
      it("Should NOT alter the queried <Admin> model in any way", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: ownerAdminId });
          expect(queriedAdminModel).to.eql(ownerUser);
        } catch (error) {
          throw error;
        }
      });
    });
    
  });
  // END Admin logged in editing other admins account //
  // CONTEXT Admin with OWNER priviliges //
  context(("Admin Client - OWNER LEVEL - Logged in"), function() {
    let adminId: string;
    let ownerId: string;

    before(() => {
      adminId = adminUser._id.toHexString();
      ownerId = ownerUser._id.toHexString();
    });

    describe("PATCH /api/admins/:admin_id - invalid data - OTHER ADMINS Account - default response", function() {
      
      it("Should NOT update an EXISTING Admin model witn INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${adminId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ adminData: { } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT update and change PASSWORD with INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${adminId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ passwordChangeData: { } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
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
      it("Should NOT alter the queried <Admin> model in any way", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: adminId });
          expect(queriedAdminModel).to.eql(adminUser);
        } catch (error) {
          throw error;
        }
      });
    });
    
    describe("PATCH /api/admins/:admin_id - OTHER ADMINS Account - valid data - default response", function() {
      let newMockData: ReqAdminData;
      let _editedAdmin: AdminData;
      before(() => {
        newMockData = generateMockAdminData();
      });

      it("Should correctly update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${adminId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ adminData: newMockData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedAdmin } = body as EditAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedAdmin).to.be.an("object");
            done();
          });
      });
      it("Should correctly update and change PASSWORD with validfields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${adminId}`)
          .set({ Authorization: adminJWTToken })
          .send({ passwordChangeData: { newPassword: "newpassword2", confirmNewPassword: "newpassword2", oldPassword: newAdminPassword } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedAdmin } = body as EditAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedAdmin).to.be.an("object");
            // 
            expect(body.error).to.be.undefined;
            expect(body.errorMessages).to.be.undefined;
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
      it("Should correctly  alter the queried <Admin> model in the database", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: adminId });
          expect(queriedAdminModel._id.toHexString()).to.equal(adminUser._id.toHexString());
          expect(queriedAdminModel.firstName).to.equal(newMockData.firstName);
          expect(queriedAdminModel.lastName).to.equal(newMockData.lastName);
          expect(queriedAdminModel.email).to.equal(newMockData.email);
          expect(queriedAdminModel.editedAt).to.be.an("date");
          expect(queriedAdminModel.createdAt).to.be.an("date");
          // password should not be sent back, <Admin.role> should not change, <Admin.confirmer> should not change>
          expect(queriedAdminModel.role).to.equal("admin");
          expect(queriedAdminModel.confirmed).to.equal(adminUser.confirmed);
          // password should be changed as well //
          expect(queriedAdminModel.password).to.not.equal(adminUser.password);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST Other Admins accont valid data //
    // TEST Own account invalid data //
    describe("PATCH /api/admins/:admin_id - invalid data - OWN Account - default response", function() {
      let newMockData: ReqAdminData;
      let _editedAdmin: AdminData;
      before(() => {
        newMockData = generateMockAdminData();
      });
      it("Should NOT update an EXISTING Admin model witn INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ adminData: { } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            //
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(body.editedAdmin).to.be.undefined;
            done();
          });
      });
      it("Should NOT update and change PASSWORD with INVALID fields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ passwordChangeData: { } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
            //
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(body.editedAdmin).to.be.undefined;
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
      it("Should NOT alter the queried <Admin> model in any way", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: ownerId });
          expect(queriedAdminModel).to.eql(ownerUser);
        } catch (error) {
          throw error;
        }
      });
    });
    
    describe("PATCH /api/admins/:admin_id - OTHER ADMINS Account - valid data - default response", function() {
      let newMockData: ReqAdminData;
      let _editedAdmin: AdminData;

      before(() => {
        newMockData = generateMockAdminData();
      });

      it("Should correctly update an EXISTING Admin model and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ adminData: newMockData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedAdmin, error, errorMessages } = body as EditAdminRes;
            //
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedAdmin).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should correctly update and change PASSWORD with validfields and send back a correct response", (done) => {
        chai.request(server)
          .patch(`/api/admins/${ownerId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ passwordChangeData: { newPassword: "newpassword2", confirmNewPassword: "newpassword2", oldPassword: "password" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedAdmin, error, errorMessages } = body as EditAdminRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedAdmin).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
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
      it("Should correctly  alter the queried <Admin> model in the database", async () => {
        try {
          const queriedAdminModel: IAdmin = await Admin.findOne({ _id: ownerId });
          expect(queriedAdminModel._id.toHexString()).to.equal(ownerUser._id.toHexString());
          expect(queriedAdminModel.firstName).to.equal(newMockData.firstName);
          expect(queriedAdminModel.lastName).to.equal(newMockData.lastName);
          expect(queriedAdminModel.email).to.equal(newMockData.email);
          expect(queriedAdminModel.editedAt).to.be.a("date");
          expect(queriedAdminModel.createdAt).to.be.a("date");
          // password should not be sent back, <Admin.role> should not change, <Admin.confirmed> should not change>
          expect(queriedAdminModel.role).to.equal("admin");
          expect(queriedAdminModel.confirmed).to.equal(ownerUser.confirmed);
          // password should be changed as well //
          expect(queriedAdminModel.password).to.not.equal(ownerUser.password);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST Own account invalid data //
  });
  // END CONTEXT Admin with OWNER privileges //
  after(async () => {
    try {
      await Admin.deleteMany();
      await User.deleteMany();
    } catch (error) {
      throw error;
    }
  });
});