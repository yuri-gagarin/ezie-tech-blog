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
import type { RegisterRes } from "@/redux/_types/auth/dataTypes";
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

  context("User Registration - invalid data", () => {
    describe("User Registration with an INVALID EMAIL field", () => {
      it("Should NOT register a new User with an EMPTY EMAIL field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "", password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
      it("Should NOT register a new User with a WRONG type of EMAIL field and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "", password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
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
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
    });
    /*
    describe("User Registration with an INVALID PASSWORD field", () => {

    });
    */
    /*
    describe("User Registration with an INVALID PASSWORD CONFIRM field", () => {

    });
    */
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