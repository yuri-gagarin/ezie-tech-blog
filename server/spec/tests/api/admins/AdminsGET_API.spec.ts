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
import type { GetAllAdminsRes, ErrorAdminRes } from "@/redux/_types/admins/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

// AT the moment all should be able to access admin Users //
describe("AdminsController:Index GET API Tests", function () {
  // custom timeout //
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
            done();
          });
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
            done();
          });
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
            done();
          });
      });
    });
  });
  // END CONTEXT LOGGED in Admin //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});