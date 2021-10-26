import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
//
import Admin from "../../../../src/models/Admin";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { GetAllUsersRes } from "@/redux/_types/users/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("UsersController GET API Tests", () => {
  let adminUser: IAdmin;
  let adminJWTToken: string;
  let server: Express;

  before(async () => {
    try {
      await generateMockAdmins(1);
      await generateMockUsers(20);
      // adminUser //
      adminUser = await Admin.findOne({});
      //
      server = ServerInstance.getExpressServer();
    } catch (error) {
      throw error;
    }
  });
  // login admin //
  before(async () => {
    try {
      const { email } = adminUser;
      const tokenData = await loginUser({ chai, email, server });
      adminJWTToken = tokenData.userJWTToken;
    } catch (error) {
      throw (error);
    }
  })
  // CONTEXT LOGGED IN ADMIN //
  context("Logged In Admin", () => {
    describe("GET /api/users default response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=true  response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: adminJWTToken })
          .query({ confirmed: true })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=false  response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: adminJWTToken })
          .query({ confirmed: false })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(false);
            }
            done();
          });
      });
    });
  });
  // END CONTEXT LOGGED IN ADMIN //
})

export {}