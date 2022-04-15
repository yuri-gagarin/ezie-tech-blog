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
import type { RegisterRes, DeleteUserRegRes } from "@/redux/_types/auth/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";


chai.use(chaiHTTP);

describe("AuthController:deleteUserProfile - Userregistration DELETE API tests", () => {
  let server: Express;
  //
  let adminUser: IAdmin; let ownerAdminUser: IAdmin;
  let readerUser: IUser; let secondReaderUser: IUser;
  let contributorUser: IUser; let secondContributorUser: IUser;
  // email strings //
  let adminUserEmail: string; let ownerUserEmail: string;
  let readerUserEmail: string; let secondReaderUserEmail: string;
  let contributorUserEmail: string; let secondContributorUserEmail: string;
  // login tokens //
  let adminUserToken: string; let ownerUserToken: string;
  let readerUserToken: string; let secondReaderUserToken: string;
  let contributorUserToken: string; let secondContributorUserToken: string;
  //
  let numOfUserModels: number = 0; let numOfAdminModels: number = 0;
  // status codes constants //
  // response constants //
  const successResCode: number = 200;
  const badRequestResCode: number = 400;
  const unauthorizedResCode: number = 401;
  const forbiddenAccessCode: number = 403;
  const notFoundAccessCode: number = 404;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      adminUser = (await generateMockAdmins(1, "admin"))[0];
      ownerAdminUser = (await generateMockAdmins(1, "owner"))[0];
      ([ readerUser, secondReaderUser ] = await generateMockUsers({ number: 4, type: "READER", confirmed: true }));
      ([ contributorUser, secondContributorUser ] = await generateMockUsers({ number: 4, type: "CONTRIBUTOR", confirmed: true }));
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
    ({ email: readerUserEmail } = readerUser);
    ({ email: secondReaderUserEmail } = secondReaderUser);
    ({ email: contributorUserEmail } = contributorUser);
    ({ email: secondContributorUserEmail } = secondContributorUser);
    // login tokens //
    ({ userJWTToken: adminUserToken } = await loginUser({ chai, server, email: adminUserEmail }));
    ({ userJWTToken: readerUserToken } = await loginUser({ chai, server, email: readerUserEmail }));
    ({ userJWTToken: secondReaderUserToken } = await loginUser({ chai, server, email: secondReaderUserEmail }));
    ({ userJWTToken: contributorUserToken } = await loginUser({ chai, server, email: contributorUserEmail }));
    ({ userJWTToken: secondContributorUserToken } = await loginUser({ chai, server, email: secondContributorUserEmail }));
  });


  // CONTEXT User profile delete no login //
  context("User Profile - DELETE - User NOT logged in", () => {
    describe("DELETE /api/delete_user_profile - VALID DATA - USER NOT LOGGED IN", () => {
      it(`Should NOT delete User profile with WITHOUT a login token and return a correct <${unauthorizedResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: "" })
          .send({ email: readerUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(unauthorizedResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete User profile with WITH an INCORRECT TOKEN SIGNATURE and return a correct <${unauthorizedResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
          .send({ email: readerUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(unauthorizedResCode);
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
          const queriedUser: IUser | null = await User.findOne({ email: readerUserEmail });
          //
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(queriedUser).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
    })
  });
  // END CONTEXT User proile delete no login //

  // TEST CONTEXT User profile delete WITH LOGIN invalid data //
  context("User Profile - DELETE - User LOGGED IN - INVALID DATA - OWN PROFILE", () => {
    // TEST invalid email fields //
    describe("DELETE /api/delete_user_profile - User Delete with an INVALID EMAIL field", () => {
      // invalid email type //
      it(`Should NOT delete User profile with an INVALID EMAIL TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: readerUserToken })
          .send({ email: {}, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      // empty email //
      it(`Should NOT delete User profile with an EMPTY EMAIL FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: readerUserToken })
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
      // non existing email //
      it(`Should NOT delete User profile with an NON EXISTING EMAIL and return a correct <${notFoundAccessCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: readerUserToken })
          .send({ email: "notexisting@email.com", password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(404);
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
    // END TEST invalid email fields //
    // TEST invalid password fields //
    describe("DELETE /api/delete_user_profile - User Delete with an INVALID PASSWORD field", () => {
      it(`Should NOT delete User profile with invalid PASSWORD TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: readerUserToken })
          .send({ email: secondReaderUserEmail, password: {} })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete User profile with EMPTY PASSWORD field and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
        .delete("/api/delete_user_profile")
        .set({ Authorization: readerUserToken })
        .send({ email: secondReaderUserEmail, password: "" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete User profile with and INVALID PASSWORD field and return a correct <${unauthorizedResCode}> response`, (done) => {
        chai.request(server)
        .delete("/api/delete_user_profile")
        .set({ Authorization: readerUserToken })
        .send({ email: secondReaderUserEmail, password: "notavalidpassword" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(unauthorizedResCode);
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
          const queriedUser: IUser | null = await User.findOne({ email: readerUserEmail });
          //
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(queriedUser).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST invalid password fields //
  });
  // END TEST CONTEXT User profile delete WITH LOGIN invalid data //

  // TEST CONTEXT LOGGED IN USER trying to delete another User's profile //
  context("User Profile - DELETE - User LOGGED IN - VALID DATA", () => {
    describe("DELETE /api/delete_user_profile - User Delete with with ALL VALID FIELDS", () => {
      it("Should NOT delete the User profile and return a correct error response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: readerUserToken })
          .send({ email: secondReaderUserToken, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteUserRegRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT alter the number of <User> or <Admin< models", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins = await Admin.countDocuments();
          ///
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          //
        } catch (error) {
          console.log(error);
        }
      });
    });
  })
  // END CONTEXT LOGGED IN USER trying to delete another User's profile //
  
  // TEST CONTEXT User profile delete LOGGED IN and VALID DATA Regular user //
  context("User Profile - DELETE - valid data - Deleting OWN profile", () => {
    describe("DELETE /api/delete_user_profile - User Delete with with ALL VALID FIELDS", () => {
      it("Should CORRECTLY delete User profile and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: readerUserToken })
          .send({ email: readerUserEmail , password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteUserRegRes
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            // 
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should DECREMENT the number of User models by 1 and correctly delete the queried User model", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins = await Admin.countDocuments();
          const deletedUser: IUser | null = await User.findOne({ email: readerUserEmail }).exec();
          ///
          expect(updatedNumOfUsers).to.equal(numOfUserModels - 1);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(deletedUser).to.be.null;
          //
          numOfUserModels = updatedNumOfUsers;
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
  // END CONTEXT User profile delete LOGGED IN and VALID DATA //
  
  // CONTEXT User profile delete LOGGED IN ADMIN //
  context("User Profile - DELETE - valid data - ADMIN Deleting another User", () => {
    describe("DELETE /api/delete_user_profile - User Delete with with ALL VALID FIELDS", () => {
      it("Should CORRECTLY delete User profile and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_user_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: secondReaderUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteUserRegRes
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            // 
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should DECREMENT the number of User models by 1 and correctly delete the queried User model", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins = await Admin.countDocuments();
          const deletedUser: IUser | null = await User.findOne({ email: secondReaderUserEmail }).exec();
          ///
          expect(updatedNumOfUsers).to.equal(numOfUserModels - 1);
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(deletedUser).to.be.null;
          //
          numOfUserModels = updatedNumOfUsers;
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
  // CONTEXT User profile delete LOGGED IN ADMIN //

  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});