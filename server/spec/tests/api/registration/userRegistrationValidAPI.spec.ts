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

describe("User Registration API tests", () => {
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

  // CONTEXT User registration invalid data //
  context("User Registration - invalid data", () => {
    describe(" POST /api/register - User Registration with an INVALID EMAIL field", () => {
      it("Should NOT register a new User with an EMPTY EMAIL field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "", password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should NOT register a new User with a WRONG type of EMAIL field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: {}, password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT register a new User with a duplicate EMAIL field and return a correct response", (done) => {
        const duplicateEmail = regUser.email;
        chai.request(server)
          .post("/api/register")
          .send({ email: duplicateEmail, password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
    });
    // User Registration Invalid password field //
    describe(" POST /api/register - User Registration with an INVALID PASSWORD field", () => {
      it("Should NOT register a new User with an EMPTY PASSWORD field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "mail@mail.com", password: "", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should NOT register a new User with a WRONG type of PASSWORD field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "mail@mail.com", password: {}, confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT register a new User with an EMPTY PASSWORD CONFIRM field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "mail@mail.com", password: "password", confirmPassword: "" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should NOT register a new User with a WRONG type of PASSWORD CONFIRM field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "mail@mail.com", password: "password", confirmPassword: {} })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT register a new User with non matching PASSWORD and PASSWORD CONFIRM fields and return a correct response", (done) => {
        const duplicateEmail = regUser.email;
        chai.request(server)
          .post("/api/register")
          .send({ email: "mail@mail.com", password: "password", confirmPassword: "password1" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
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
  context("User Registration VALID fields", () => {
    describe("POST /api/register -- valid <email>, <password>, <confirmPassword> fields", () => {
      it("Should correctly register a new User and send back the correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "mail@mail.com", password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, userData, isAdmin, jwtToken, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(userData._id).to.be.a("string");
            expect(userData.firstName).to.be.a("string");
            expect(userData.lastName).to.be.a("string");
            expect(userData.email).to.equal("mail@mail.com");
            expect(userData.confirmed).to.equal(false);
            expect(userData.createdAt).to.be.a("string");
            expect(userData.editedAt).to.be.a("string");
            expect(isAdmin).to.equal(false);
            expect(jwtToken).to.be.an("object");
            expect(jwtToken.token).to.be.a("string");
            expect(jwtToken.expires).to.be.a("string");
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should be able to correctly login and receive back the correct response", (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: "mail@mail.com", password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, userData, success, isAdmin, jwtToken, error, errorMessages } = response.body as LoginRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(userData._id).to.be.a("string");
            expect(userData.email).to.equal("mail@mail.com");
            expect(userData.createdAt).to.be.a("string");
            expect(userData.editedAt).to.be.a("string");
            expect(success).to.equal(true);
            expect(isAdmin).to.equal(false);
            expect(jwtToken).to.be.an("object");
            expect(jwtToken.token).to.be.a("string");
            expect(jwtToken.expires).to.be.a("string");
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      })
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