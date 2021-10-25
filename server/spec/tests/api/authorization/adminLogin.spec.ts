import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
// models //
import Admin from "../../../../src/models/Admin";
import User from "../../../../src/models/Admin";
// server //
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { LoginRes, RegisterRes } from "@/redux/_types/auth/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";

chai.use(chaiHTTP);

describe("Admin Login API tests", () => {
  let server: Express;
  let adminUser: IAdmin;
  let regUser: IUser;
  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockAdmins(2);
      await generateMockUsers(2);
      adminUser = await Admin.findOne({});
      regUser = await User.findOne({});
    } catch (error) {
      throw(error);
    }
  });

  // CONTEXT Admin Login invalid data //
  context("Admin login - invalid data", () => {
    describe(" POST /api/login- Admin login with an INVALID EMAIL field", () => {
      it("Should NOT Login an admin with an EMPTY EMAIL field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: "", password: adminUser.password })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should NOT Login an Admin with a WRONG type of EMAIL field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: {}, password: adminUser.password,  })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT Login an Admin with with a wrong EMAIL field and return a correct response", (done) => {
        const duplicateEmail = regUser.email;
        chai.request(server)
          .post("/api/register")
          .send({ email: "wrong@mail.com", password: adminUser.password, })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
    });
    // User Registration Invalid password field //
    describe("POST /api/login - Admin Login with an INVALID PASSWORD field", () => {
      it("Should NOT Login an Admin with an EMPTY PASSWORD field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: adminUser.email, password: "" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should NOT Login an Admin with a WRONG type of PASSWORD field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: adminUser.email, password: {} })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT Login an Admin with an WRONG password field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: "mail@mail.com", password: "password", confirmPassword: "" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
    });
    // END User Registration invalid PASSWORD field //
  });
  // END Context User Registration with invalid fields //
  

  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});