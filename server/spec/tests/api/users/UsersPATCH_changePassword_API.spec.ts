import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "@/server/src/server";
//
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
// helpers //
import { generateMockAdmins, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { loginMultipleUsers } from "../../../hepers/testHelpers";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { EditUserPassRes, UserData } from "@/redux/_types/users/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes";

describe("UsersController:changePassword - PATCH - API Tests", () => {
  //
  let server: Express;
  const notValidObjectId = "notavalidbsonobjectid";
  const invalidJWTToken = "notavalidjwt"
  // user models //
  let firstReaderUser: IUser; let secondReaderUser: IUser; let firstContributorUser: IUser; let secondContributorUser: IUser;
  // admin models //
  let adminUser: IAdmin; let ownerAdminUser: IAdmin;
  // login tokens //
  let firstReaderUserJWTToken: string; let secondReaderUserJWTToken: string; let firstContUserJWTToken: string; let secondContUserJWTToken: string;
  let adminUserJWTToken: string; let ownerUserJWTToken: string;
  // data counts //
  let numOfUserModels: number = 0;
  let numOfAdminModels: number = 0;
  // response constants //
  const successResCode: number = 200;
  const badRequestResCode: number = 400;
  const unauthorizedResCode: number = 401;
  const forbiddenAccessCode: number = 403;
  const notFoundAccessCode: number = 404;

  // generate mock models //
  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      adminUser = (await generateMockAdmins(1, "admin"))[0];
      ownerAdminUser = (await generateMockAdmins(1, "owner"))[0];
      ([ firstReaderUser, secondReaderUser ] = await generateMockUsers({ number: 4, type: "READER", confirmed: true }));
      ([ firstContributorUser, secondContributorUser ] = await generateMockUsers({ number: 4, type: "CONTRIBUTOR", confirmed: true }));
      // count models //
      numOfUserModels = await User.countDocuments();
      numOfAdminModels = await Admin.countDocuments();
    } catch (error) {
      throw(error);
    }
  });
  // generat login tokens for tests with login // // login tokens //
  before(async () => {
    const userEmails = [ firstReaderUser.email, secondReaderUser.email, firstContributorUser.email, secondContributorUser.email ];
    const adminUserEmails = [ adminUser.email, ownerAdminUser.email ];
    // login all, extract tokens //
    try {
      ([ firstReaderUserJWTToken, secondReaderUserJWTToken, firstContUserJWTToken, secondContUserJWTToken ] = await loginMultipleUsers({ server, chai, loginEmails: userEmails }));
      ([ adminUserJWTToken, ownerUserJWTToken ] = await loginMultipleUsers({ server, chai, loginEmails: adminUserEmails }));
    } catch (error) {
      throw error;
    }
  });

  // CONTEXT UsersContreller:updateUserPassword no login //
  context("User Change Password - PATCH - User NOT LOGGED IN - VALID DATA", () => {
    describe(`PATCH /api/users/change_password - Change Password - WITH VALID REQUEST DATA`, () => {
      it(`Should NOT change User password with WITHOUT a login token and return a correct <${unauthorizedResCode}> response`, (done) => {
        const userId: string = firstContributorUser._id.toHexString();
        chai.request(server)
          .patch("/api/users/change_password")
          .send({ newPassword: "newPassword", confirmNewPassword: "newPassword", oldPassword: "password", userId })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(unauthorizedResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT change User password with WITH an invalid login token and return a correct <${unauthorizedResCode}> response`, (done) => {
        const userId: string = firstContributorUser._id.toHexString();
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
          .send({ newPassword: "newPassword", confirmNewPassword: "newPassword", oldPassword: "password", userId })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(unauthorizedResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
    });
  });
  // END CONTEXT UsersContreller:updateUserPassword no login //

  /*
  // TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls INVALID DATA //
  context("User Change Password - PATCH - User LOGGED IN - INVALID DATA(OR MISSING FIELDS) - OWN PROFILE", () => {
    // TEST missing or not allowed data fields //
    describe("PATCH /api/users/change_password - Change Password - with MISSING OR NOT ALLOWED data fields", () => {
      // missing <req.body.userId> field //
      it(`Should NOT change User password with a missing <req.body.userId> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ passwordData: { oldPassword: "password", newPassword: "newPassword", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      // missing <req.body.passwordData> field //
      it(`Should NOT change User password with a missing <req.body.paswordData> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        const userId: string = firstReaderUser._id.toHexString();
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      // missing <req.body.userId> AND <req.body.passwordData> fields //
      it(`Should NOT change User password with a missing <req.body.paswordData> AND <req.body.userId> FIELDS and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send()
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      // PRESENT <req.body.userId> AND <req.body.passwordData> fields WITH EXTRA NOT ALLOWED field //
      it(`Should NOT change User password with a NOT ALLOWED FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        const userId: string = firstReaderUser._id.toHexString();
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: "password", newPassword: "newPassword", confirmNewPassword: "newPassword" }, notAllowedField: "this is not allowed" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
    });
    // END TEST missing or not allowed data fields //

    // TEST invalid userId fields //
    describe("PATCH /api/users/change_password - User with an INVALID <req.body.userId> field", () => {
      // invalid userId type //
      it(`Should NOT change User password with an INVALID <req.body.userId> TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId: {}, passwordData: { oldPassword: "password", newPassword: "newPassword", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      // invalid userId BSON type //
      it(`Should NOT change User password with an INVALID <req.body.userId> TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId: notValidObjectId, passwordData: { oldPassword: "password", newPassword: "newPassword", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      // empty UserId //
      it(`Should NOT change User password with an EMPTY <req.body.userId> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId: "", passwordData: { oldPassword: "password", newPassword: "newPassword", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
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
    // END TEST invalid userId fields //
    // TEST invalid <passwordData> fields //
    describe("PATCH /api/users/change_password - User with an INVALID <req.body.paswordData> field", () => {
      let userId: string;
      before(() => {
        userId = firstReaderUser._id.toHexString();
      });
      // invalid <passwordData> type //
      it(`Should NOT change User password with an INVALID <req.body.passwordData> TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: "should be an object" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
       // empty <passwordData> type //
       it(`Should NOT change User password with an EMPTY <req.body.passwordData> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: "" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
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
    // END TEST invalid <passwordData> fields //
    // testing with wrong password data //
    // TEST invalid <req.body.passwordData.oldPassword> field //
    describe("PATCH /api/users/change_password - User with an INVALID or MISSING DATA in <req.body.paswordData> field", () => {
      let userId: string;
      before(() => {
        userId = firstReaderUser._id.toHexString();
      });
      // invalid <req.body.passwordData.oldPasswrod> type //
      it(`Should NOT change User password with an INVALID <req.body.passwordData.oldPassword> TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: {}, newPassword: "newPassword", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
      // empty <req.body.passwordData.oldPassword> field //
      it(`Should NOT change User password with an EMPTY <req.body.passwordData.oldPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: "", newPassword: "newPassword", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
      // invalid <req.body.passwordData.newPassword> type //
      it(`Should NOT change User password with an INVALID <req.body.passwordData.newPasswowrd> TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: "password", newPassword: {}, confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(2);
            done();
          });
      });
      // empty <req.body.passwordData.newPassword> field //
      it(`Should NOT change User password with an EMPTY <req.body.passwordData.newPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: "password", newPassword: "", confirmNewPassword: "newPassword" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
      // invalid <req.body.passwordData.confirmPassword> type //
      it(`Should NOT change User password with an INVALID <req.body.passwordData.confirmNewPassword> TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: "password", newPassword: "newPasswrod", confirmNewPassword: {} } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(2);
            done();
          });
      });
      // empty <req.body.passwordData.confirmPassword> field //
      it(`Should NOT change User password with an EMPTY <req.body.passwordData.confirmNewPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { oldPassword: "password", newPassword: "newPasswrod", confirmNewPassword: "" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
    });
    // END TEST invalid <req.body.passwrodDAta.oldPassword> field //
  });
  // END TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls  INVALID DATA //
  */

  // TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls VALID DATA FIELDS //
  context(" User Change Password - PATCH - User LOGGED IN - VALID DATA - OWN PROFILE", () => {
    let userId: string;
    let passwordData: { oldPassword: string; newPassword: string; confirmNewPassword: string; }; 
    before(() => {
      userId = firstReaderUser._id.toHexString();
      passwordData = { oldPassword: "password", newPassword: "newPassword", confirmNewPassword: "newPassword" };
    });
    // TEST either invalid <oldPassword> field or mismatching <newPassword> and <confirmNewPassword> fields //
    describe("PATCH /api/users/change_password - User entered EITHER a wrong OLD PASSWORD or MISMATCHING <req.body.passwordData.newPassword> and <req.body.passwordData.confirmNewPassword>", () => {
      // wrong <oldPassworD> field //
      it(`Should NOT change User password with a WRONG <req.body.passwordData.oldPassword> FIELD and return a correct <${forbiddenAccessCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { ...passwordData, oldPassword: "thisiswrong" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(forbiddenAccessCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
      // mismatching <newPassword> field //
      it(`Should NOT change User password with a MISMATCHING <req.body.passwordData.newPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { ...passwordData, newPassword: "doesntmatch" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
      // mismatching <confirmNewPassword> field //
      it(`Should NOT change User password with a MISMATCHING <req.body.passwordData.confirmNewPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData: { ...passwordData, confirmNewPassword: "doesntmatch" } })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(errorMessages.length).to.equal(1);
            done();
          });
      });
    });
    // END TEST either invalid <oldPassword> field or mismatching <newPassword> and <confirmNewPassword> fields //

  });
  // cleanup models //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
})