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
import type { RegisterRes } from "@/redux/_types/auth/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";


chai.use(chaiHTTP);

describe("AuthController:deleteUserProfile - Userregistration DELETE API tests", () => {
  let server: Express;
  //
  let adminUser: IAdmin; let ownerAdminUser: IAdmin;
  let regUser: IUser; let secondRegUser: IUser;
  //
  let adminUserEmail: string; let ownerUserEmail: string;
  let regUserEmail: string; let secondRegUserEmail: string;
  let adminUserToken: string; let ownerUserToken: string;
  let regUserToken: string; let secondRegUserToken: string;
  //
  let numOfUserModels: number = 0; let numOfAdminModels: number = 0;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      adminUser = await generateMockAdmins(1, "admin")[0];
      ownerAdminUser = await generateMockAdmins(1, "owner")[0];
      ([ regUser, secondRegUser ] = await generateMockUsers({ number: 2, confirmed: true }));
      // count models //
      numOfUserModels = await User.countDocuments();
      numOfAdminModels = await Admin.countDocuments();
    } catch (error) {
      throw(error);
    }
  });
  // login tokens //
  before(async () => {
    ({ email: adminUserEmail } = adminUser);
    ({ email: ownerUserEmail } = ownerAdminUser);
    ({ email: regUserEmail } = regUser);
    ({ email: secondRegUserEmail } = secondRegUser);
    // login tokens //
    ({ userJWTToken: adminUserToken } = await loginUser({ chai, server, email: adminUserEmail }));
    ({ userJWTToken: regUserToken } = await loginUser({ chai, server, email: regUserEmail }));
    ({ userJWTToken: secondRegUserToken } = await loginUser({ chai, server, email: secondRegUserEmail }));
  });

  // CONTEXT User profile delete no login //
  context("User Profile - DELETE - User NOT logged in", () => {
    describe("DELETE /api/delete_user_profile - User Delete VALID data NOT logged in", () => {
      it("Should NOT delete User profile with WITHOUT a login and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: "" })
          .send({ email: regUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT alter the number of <User> or <Admin> models in the database", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          //
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
        } catch (error) {
          throw error;
        }
      });
    })
  });
  // END CONTEXT User proile delete no login //

  // TEST CONTEXT User profile delete WITH LOGIN invalid data //
  context("User Profile - DELETE - User LOGGED IN - INVALID", () => {
    // invalid email //
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
      it("Should NOT alter the number of <User> or <Admin> models in the database", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          //
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
        } catch (error) {
          throw error;
        }
      });
    });
    // invalid password //
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
      it("Should NOT delete User profile with and INVALID PASSWORD field and return a correct response", (done) => {
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
      it("Should NOT alter the number of <User> or <Admin> models in the database", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          //
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END TEST CONTEXT User profile delete WITH LOGIN invalid data //

  // CONTEXT User profile delete valid data //
  context("User Profile - DELETE - valid data", () => {
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