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
import type { LoginRes, RegisterRes } from "@/redux/_types/auth/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";


chai.use(chaiHTTP);

describe("AuthController:Register - User Registration API tests", () => {
  let server: Express;
  //
  let adminUser: IAdmin;
  let regUser: IUser;
  let secondRegUser: IUser;
  //
  let adminUserEmail: string; let regUserEmail: string; let secondRegUserEmail: string;
  let adminUserToken: string; let regUserToken: string; let secondRegUserToken: string;
  //
  let numOfUserModels: number = 0;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockAdmins(1);
      await generateMockUsers({ number: 2, confirmed: true });
      adminUser = await Admin.findOne({});
      ([ regUser, secondRegUser ] = await User.find({}));
      // count models //
      numOfUserModels = await User.countDocuments();
    } catch (error) {
      throw(error);
    }
  });
  // login tokens //
  before(async () => {
    ({ email: adminUserEmail } = adminUser);
    ({ email: regUserEmail } = regUser);
    ({ email: secondRegUserEmail } = secondRegUser);
    // login tokens //
    ({ userJWTToken: adminUserToken } = await loginUser({ chai, server, email: adminUserEmail }));
    ({ userJWTToken: regUserToken } = await loginUser({ chai, server, email: regUserEmail }));
    ({ userJWTToken: secondRegUserToken } = await loginUser({ chai, server, email: secondRegUserEmail }));
  });

  // CONTEXT User profile delete invalid data //
  context("User Profile - DELETE - invalid data", () => {
    describe("DELETE /api/delete_user_profile - User Delete with an INVALID EMAIL field", () => {
      it("Should NOT delete User profile with an INVALID EMAIL TYPE and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .send({ email: {}, password: "password" })
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
      it("Should NOT delete User profile with an EMPTY EMAIL FIELD and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .send({ email: "", password: "password" })
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
      it("Should NOT delete User profile with an NON EXISTING EMAIL and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .send({ email: "notexisting@email.com", password: "password" })
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
    describe("DELETE /api/delete_user_profile - User Delete with an INVALID PASSWORD field", () => {
      it("Should NOT delete User profile with invalid PASSWORD TYPE and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .send({ email: "email@email.com", password: {} })
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
      it("Should NOT delete User profile with EMPTY PASSWORD field and return a correct response", (done) => {
        chai.request(server)
        .delete("/api/delete_user_profile")
        .send({ email: "email@email.com", password: "" })
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
      it("Should NOT delete User profile with EINVALID PASSWORD field and return a correct response", (done) => {
        chai.request(server)
        .delete("/api/delete_user_profile")
        .send({ email: "email@email.com", password: "notavalidpassword" })
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
    
   
  });

  // CONTEXT User profile delete valid data //
  context("User Profile - DELETE - valalid data", () => {
    describe("DELETE /api/delete_user_profile - User Delete with with ALL VALID FIELDS", () => {
      it("Should CORRECTLY delete User profile and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: "needatokenhere" })
          .send({ email: {}, password: "password" })
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
      it("Should DECREMENT the number of User models by 1", async () => {
        try {
          const numOfUsers: number = await User.countDocuments();
          expect(numOfUsers).to.equal(numOfUserModels - 1);
          //
          numOfUserModels = numOfUsers;
        } catch (error) {
          console.log(error);
        }
      });
    });
  })
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});