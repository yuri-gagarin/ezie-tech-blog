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
import type { AdminData, ErrorAdminRes, GetAllAdminsRes, GetOneAdminRes } from "@/redux/_types/admins/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

// AT the moment all should be able to access admin Users //
describe("AdminsController:Index & AdminsController:GetOne GET API Tests", function () {
  // custom timeout //
  this.timeout(10000);
  //
  const notValidObjectId = "notavalidbsonobjectid";
  let server: Express;
  // model counts //
  // user models //
  let adminUser: IAdmin;
  let readerRegUser: IUser;
  let contributorRegUser: IUser;
  // login tokens //
  let adminJWTToken: string;
  let readerUserJWTToken: string;
  let contributorUserJWTToken: string;

  before(() => {
    server = ServerInstance.getExpressServer();
  });
  before(async () => {
    try {
      await generateMockAdmins(20);
      await generateMockUsers({ number: 1, type: "READER" });
      await generateMockUsers({ number: 1, type: "CONTRIBUTOR" });
      // adminUser //
      adminUser = await Admin.findOne({});
      readerRegUser = await User.findOne({ userType: "READER" });
      contributorRegUser = await User.findOne({ userType: "CONTRIBUTOR" });
      //
    } catch (error) {
      throw error;
    }
  });
  // login admin //
  before(async () => {
    try {
      const { email: adminEmail } = adminUser;
      const { email: readerEmail } = readerRegUser;
      const { email: contributorEmail } = contributorRegUser;
      //
      ({ userJWTToken: adminJWTToken  } = await loginUser({ chai, email: adminEmail, server }));
      ({ userJWTToken: readerUserJWTToken  } = await loginUser({ chai, email: readerEmail, server }));
      ({ userJWTToken: contributorUserJWTToken  } = await loginUser({ chai, email: contributorEmail, server }));
    } catch (error) {
      throw (error);
    }
  });
  context("AdminsController:Index GET API Tests", () => {
    let foundAdmins: AdminData[];
    // CONTEXT NOT LOGGED IN //
    context("Guest Client - NOT Logged in", () => {
      describe("GET /api/admins default response", () => {
        it("Should be able to retreive Admin models and send back the correct response", (done) => {
          chai.request(server)
            .get("/api/admins")
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, admins } = response.body as GetAllAdminsRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(admins).to.be.an("array");
              expect(admins.length).to.be.at.most(10);
              //
              foundAdmins = admins;
              done();
            });
        });
        it("Should return correct properties in the <AdminData> type response", () => {
          for (const foundAdmin of foundAdmins) {
            expect(foundAdmin._id).to.be.a("string");
            expect(foundAdmin.firstName).to.be.a("string");
            expect(foundAdmin.lastName).to.be.a("string");
            expect(foundAdmin.email).to.be.a("string");
            expect(foundAdmin.role).to.be.a("string");
            expect(foundAdmin.editedAt).to.be.a("string");
            expect(foundAdmin.createdAt).to.be.a("string");
            // password should not be sent for obvious reasons //
            expect(foundAdmin.password).to.be.undefined;
          }
        });
      });
    });
    // CONTEXT LOGGED IN  USER //
    context("User Client - Logged in", () => {
      describe("GET /api/admins default response", () => {
        it("Should be able to retreive Admin models and send back the correct response", (done) => {
          chai.request(server)
            .get("/api/admins")
            .set({ Authorization: readerUserJWTToken })
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, admins } = response.body as GetAllAdminsRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(admins).to.be.an("array");
              expect(admins.length).to.be.at.most(10);
              //
              foundAdmins = admins;
              done();
            });
        });
        it("Should return correct properties in the <AdminData> type response", () => {
          for (const foundAdmin of foundAdmins) {
            expect(foundAdmin._id).to.be.a("string");
            expect(foundAdmin.firstName).to.be.a("string");
            expect(foundAdmin.lastName).to.be.a("string");
            expect(foundAdmin.email).to.be.a("string");
            expect(foundAdmin.role).to.be.a("string");
            expect(foundAdmin.editedAt).to.be.a("string");
            expect(foundAdmin.createdAt).to.be.a("string");
            // password should not be sent for obvious reasons //
            expect(foundAdmin.password).to.be.undefined;
          }
        });
      });
    });
    // CONTEXT LOGGED IN ADMIN //
    context("Admin Client - Logged in", () => {
      describe("GET /api/admins default response", () => {
        it("Should be able to retreive Admin models and send back the correct response", (done) => {
          chai.request(server)
            .get("/api/admins")
            .set({ Authorization: adminJWTToken })
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, admins } = response.body as GetAllAdminsRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(admins).to.be.an("array");
              expect(admins.length).to.be.at.most(10);
              //
              foundAdmins = admins;
              done();
            });
        });
        it("Should return correct properties in the <AdminData> type response", () => {
          for (const foundAdmin of foundAdmins) {
            expect(foundAdmin._id).to.be.a("string");
            expect(foundAdmin.firstName).to.be.a("string");
            expect(foundAdmin.lastName).to.be.a("string");
            expect(foundAdmin.email).to.be.a("string");
            expect(foundAdmin.role).to.be.a("string");
            expect(foundAdmin.editedAt).to.be.a("string");
            expect(foundAdmin.createdAt).to.be.a("string");
            // password should not be sent for obvious reasons //
            expect(foundAdmin.password).to.be.undefined;
          }
        });
      });
    });
    // END CONTEXT LOGGED in Admin //
  });
  // END TEST AdminsController:Index action //
  // TEST AdminsController:GetOne action //
  context("AdminsController:GetOne GET API Tests", () => {
    let adminId: string;
    let foundAdmin: AdminData;
    before(() => {
      adminId = adminUser._id.toHexString();
    });
    // CONTEXT NOT LOGGED IN //
    context("Guest Client - NOT Logged in", () => {
      describe("GET /api/admins/:admin_id - default response", () => {
        it("Should be able to retreive Admin models and send back the correct response", (done) => {
          chai.request(server)
            .get(`/api/admins/${adminId}`)
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, admin } = response.body as GetOneAdminRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(admin).to.be.an("object");
              //
              expect(response.body.error).to.be.undefined;
              expect(response.body.errorMessages).to.be.undefined;
              //
              foundAdmin = admin;
              done();
            });
        });
        it("Should return correct properties in the <AdminData> type response", () => {
          expect(foundAdmin._id).to.be.a("string");
          expect(foundAdmin.firstName).to.be.a("string");
          expect(foundAdmin.lastName).to.be.a("string");
          expect(foundAdmin.email).to.be.a("string");
          expect(foundAdmin.role).to.be.a("string");
          expect(foundAdmin.editedAt).to.be.a("string");
          expect(foundAdmin.createdAt).to.be.a("string");
          // password should not be sent for obvious reasons //
          expect(foundAdmin.password).to.be.undefined;
        });
      });
    });
    // CONTEXT LOGGED IN  USER //
    context("User Client - Logged in", () => {
      describe("GET /api/admins/:admin_id default response", () => {
        it("Should be able to retreive Admin models and send back the correct response", (done) => {
          chai.request(server)
            .get(`/api/admins/${adminId}`)
            .set({ Authorization: readerUserJWTToken })
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, admin } = response.body as GetOneAdminRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(admin).to.be.an("object");
              //
              expect(response.body.error).to.be.undefined;
              expect(response.body.errorMessages).to.be.undefined;
              //
              foundAdmin = admin;
              done();
            });
        });
        it("Should return correct properties in the <AdminData> type response", () => {
          expect(foundAdmin._id).to.be.a("string");
          expect(foundAdmin.firstName).to.be.a("string");
          expect(foundAdmin.lastName).to.be.a("string");
          expect(foundAdmin.email).to.be.a("string");
          expect(foundAdmin.role).to.be.a("string");
          expect(foundAdmin.editedAt).to.be.a("string");
          expect(foundAdmin.createdAt).to.be.a("string");
          // password should not be sent for obvious reasons //
          expect(foundAdmin.password).to.be.undefined;
        });
      });
    });
    // CONTEXT LOGGED IN ADMIN //
    context("Admin Client - Logged in", () => {
      describe("GET /api/admins default response", () => {
        it("Should be able to retreive Admin models and send back the correct response", (done) => {
          chai.request(server)
            .get(`/api/admins/${adminId}`)
            .set({ Authorization: readerUserJWTToken })
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, admin } = response.body as GetOneAdminRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(admin).to.be.an("object");
              //
              expect(response.body.error).to.be.undefined;
              expect(response.body.errorMessages).to.be.undefined;
              //
              foundAdmin = admin;
              done();
            });
        });
        it("Should return correct properties in the <AdminData> type response", () => {
          expect(foundAdmin._id).to.be.a("string");
          expect(foundAdmin.firstName).to.be.a("string");
          expect(foundAdmin.lastName).to.be.a("string");
          expect(foundAdmin.email).to.be.a("string");
          expect(foundAdmin.role).to.be.a("string");
          expect(foundAdmin.editedAt).to.be.a("string");
          expect(foundAdmin.createdAt).to.be.a("string");
          // password should not be sent for obvious reasons //
          expect(foundAdmin.password).to.be.undefined;
        });
      });
    });
    // END CONTEXT LOGGED in Admin //
    // CONTEXT TESTS with INVALID query data //
    context("Any Client - INVALID Request data", function () {
      describe("GET /api/admins/:admin_id - INVALID <admin_id> TYPE in <req.params>", function () {
        it("Should NOT send back an Admin model and respond with appropriate 400 error", (done) => {
          chai.request(server)
            .get(`/api/admins/${notValidObjectId}`)
            .set({ Authorization: readerUserJWTToken })
            .end((err, response) => {
              if (err) done(err);
              const { status, body } = response;
              const { responseMsg, error, errorMessages } = body as ErrorAdminRes;
              expect(status).to.equal(400);
              expect(responseMsg).to.be.a("string");
              expect(error).to.be.an("object");
              expect(errorMessages).to.be.an("array");
              //
              expect(body.admin).to.be.undefined;
              //
              done();
            });
        });
      });
    });
    // END CONTEXT TESTS with INVALID query data //
  });
  // END TEST AdminsController:GetOne action //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});