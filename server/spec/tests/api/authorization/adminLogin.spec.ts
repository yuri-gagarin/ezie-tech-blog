import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
// models //
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
// server //
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/generalTypes";
import type { UserData } from "@/redux/_types/users/dataTypes";
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
      await generateMockUsers({ number: 2, confirmed: true });
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
  });
  // END Context Admin Login with invalid fields //
  // CONTEXT Admin Login with valid fields //
  context("Admin Login VALID fields", () => {
    describe("POST /api/login -- valid <email>, <password> fields", () => {
      it("Should be able to correctly login and receive back the correct response", (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: adminUser.email, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, userData,  success, isAdmin, jwtToken, adminFirebaseAuth, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(success).to.equal(true);
            expect(isAdmin).to.equal(true);
            expect(jwtToken).to.be.an("object");
            expect(jwtToken.token).to.be.a("string");
            expect(jwtToken.expires).to.be.a("string");
            expect(adminFirebaseAuth).to.be.an("object");
            expect(adminFirebaseAuth.adminFirebaseToken).to.be.a("string");
            expect(adminFirebaseAuth.expires).to.be.a("number");
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // check user data //
            const { _id, firstName, lastName, email, password, role, editedAt, createdAt } = userData as AdminData;
            expect(_id).to.be.a("string");
            expect(firstName).to.be.a("string");
            expect(lastName).to.be.a("string");
            expect(email).to.be.a("string");
            expect(role).to.be.a("string");
            expect(editedAt).to.be.a("string");
            expect(createdAt).to.be.a("string");
            // password should not be sent //
            expect(password).to.be.undefined;
            done();
          });
      });
    });
  });

  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});