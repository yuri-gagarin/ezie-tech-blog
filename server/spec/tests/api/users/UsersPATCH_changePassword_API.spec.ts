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
import type { ErrorResponse } from "@/server/src/_types/auth/authTypes";
import { LoginRes } from "@/redux/_types/auth/dataTypes";

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
  // password constants //
  const oldPassword: string = "password"; const newPassword: string = "newPassword"; const wrongPassword: string = "wrongPassword";
  let passwordData: { oldPassword: string; newPassword: string; confirmNewPassword: string; } = { oldPassword, newPassword, confirmNewPassword: newPassword };
  // response constants //
  const successResCode: 200 = 200;
  const badRequestResCode: 400 = 400;
  const unauthorizedResCode: 401 = 401;
  const forbiddenAccessCode: 403 = 403;
  const notFoundAccessCode: 404 = 404;

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
          .send({ userId, passwordData: { newPassword, confirmNewPassword: newPassword, oldPassword } })
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
          .send({ userId, passwordData: { newPassword, confirmNewPassword: newPassword, oldPassword } })
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

  // TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls INVALID DATA //
  context("User Change Password - PATCH - User LOGGED IN - INVALID DATA(OR MISSING FIELDS) - OWN PROFILE", () => {
    let userId: string;
    before(() => {
      userId = firstReaderUser._id.toHexString();
    });
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
            console.log(response.body)
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
  // END TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls  INVALID DATA //

  // TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls VALID DATA FIELDS - OWN ACCOUNT //
  context(" User Change Password - PATCH - User LOGGED IN - VALID DATA - OWN PROFILE", () => {
    let userId: string;
    before(() => {
      userId = firstReaderUser._id.toHexString();
    });

    // TEST user password change with all valid/correct fields //
    describe("PATCH /api/users/change_password - User entered all correct information in <req.body.passwordData> field", () => {
      let editedUserData: UserData;
      it(`Should correctly update the User password and return a correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId, passwordData })
          .end((err, response) => {
            if(err) done(err);
            const { editedUser, responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(editedUser).to.be.an("object")
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            //
            editedUserData = editedUser;
            done();
          });
      });
      // it should return proper data in <editedUser> response object //
      it(`Should return correct <editedUser> information in the response object changing only <password> field`, () => {
        expect(editedUserData._id).to.equal(firstReaderUser._id.toHexString());
        expect(editedUserData.firstName).to.equal(firstReaderUser.firstName);
        expect(editedUserData.lastName).to.equal(firstReaderUser.lastName);
        expect(editedUserData.email).to.equal(firstReaderUser.email);
        expect(editedUserData.createdAt).to.equal(firstReaderUser.createdAt.toISOString());
        // <editedAt> should be changed>
        expect(editedUserData.editedAt).to.not.equal(firstReaderUser.editedAt.toISOString());
        // password should not be changed anot not sent back in <editedUser> object //
        expect(editedUserData.password).to.be.undefined;
      });

      // user should not be able to log in with old password anymore //
      it(`Should NOT allow login with the previous Users password and send back the correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: firstReaderUser.email, password: oldPassword })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorResponse;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });

      // user should be able to log in with new password //
      it(`Should successfuly login with the new Users password and send back the correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: firstReaderUser.email, password: newPassword })
          .end((err, response) => {
            const { responseMsg, userData, jwtToken, success, isAdmin, error, errorMessages } = response.body as LoginRes;
            if (err) done(err);
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(jwtToken).to.be.an("object");
            expect(success).to.equal(true);
            expect(isAdmin).to.equal(false);
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
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
    // END TEST user password change with all valid/correct fields //
  });
  // END TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls VALID DATA FIELDS - OWN ACCOUNT //

  // TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls VALID DATA FIELDS - OTHER USERS ACCOUNT //
  /**
   * User should only be able to change password on their own account
   * Admin can change/reset password for regular users 
   */
  context(" User Change Password - PATCH - User LOGGED IN - VALID DATA - OTHER USERS PROFILE", () => {
    let secondUsersId: string;
    //
    before(() => {
      secondUsersId = secondReaderUser._id.toHexString();
    });

    // TEST user password change with all valid/correct fields //
    describe("PATCH /api/users/change_password - User entered all correct information in <req.body.passwordData> field - OTHER USER PROFILE", () => {
      let editedUserData: UserData;
      it(`Should NOT update the User password and return a correct <${forbiddenAccessCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: firstReaderUserJWTToken })
          .send({ userId: secondUsersId, passwordData })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages, editedUser } = response.body as EditUserPassRes;
            expect(response.status).to.equal(forbiddenAccessCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedUser).to.be.undefined;
            done();
          });
      });
      // user should be able to log in with new password //
      it(`Should successfuly login with the old Users password and send back the correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: secondReaderUser.email, password: oldPassword })
          .end((err, response) => {
            const { responseMsg, userData, jwtToken, success, isAdmin, error, errorMessages } = response.body as LoginRes;
            if (err) done(err);
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(jwtToken).to.be.an("object");
            expect(success).to.equal(true);
            expect(isAdmin).to.equal(false);
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
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
      // END TEST user password change with all valid/correct fields //
    });
  });

  // END TEST CONTEXT LOGGED IN USER UsersControler:changePassword  API calls VALID DATA FIELDS - OTHER USERS ACCOUNT //

  // TEST CONTEXT LOGGED IN ADMIN UsersControler:changePassword API calls INVALID DATA FIELDS - OTHER USERS ACCOUNT //
  context("User Change Password - PATCH - ADMIN LOGGED IN - INVALID DATA - OTHER USERS PROFILE", () => {
    let secondUsersId: string;
    //
    before(() => {
      secondUsersId = secondReaderUser._id.toHexString();
    });
    // TEST missing or not allowed <req.body> fields //
    describe("PATCH /api/users/change_password - Admin editing password - MISSING or NOT ALLOWED <req.body.fields> - OTHER USER PROFILE", () => {
      // missing <req.body.userId> field //
      it(`Should NOT change User password with a missing <req.body.userId> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ passwordData })
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
      it(`Should NOT change User password with a missing <req.body.passwordData> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId })
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
      // not allowed <req.body.thisIsNotAllowed> field //
      it(`Should NOT change User password with a NOT ALLOWED <req.body.thisIsNotAllowed> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData, thisIsNotAllowed: "shoudn't be allowed" })
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
    // END TEST missing or not allowed <req.body.fields> //

    // TEST empty or wrong type <req.body> fields //
    describe("PATCH /api/users/change_password - Admin editing password - EMTPY or WRONG TYPE <req.body.fields> - OTHER USER PROFILE", () => {

      // invalid <req.body.userId> field //
      it(`Should NOT change User password with an INVALID <req.body.userId> FIELD TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: "notvaliduserid", passwordData })
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
      // empty <req.body.userId> field //
      it(`Should NOT change User password with an EMPTY <req.body.userId> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: "", passwordData })
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
      // invalid <req.body.passwordData> field //
      it(`Should NOT change User password with an INVALID <req.body.passwordData> FIELD TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: "notvaliduserid", passwordData: "notavalidobject" })
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
      // empty <req.body.passwordData> field //
      it(`Should NOT change User password with an EMPTY <req.body.passwordData> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData: "" })
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
    // END TEST empty or wrong type <req.body> fields //

    // TEST empty, wrong type or incorrect <req.body.passwordData> fields //
    describe("PATCH /api/users/change_password - Admin editing password - EMTPY or WRONG TYPE or INCORRECT <req.body.passwordData> FIELDS - OTHER USER PROFILE", () => {
      // invalid <req.body.passwordData.newPassword field //
      it(`Should NOT change User password with an INVALID <req.body.passwordData.newPassword> FIELD TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData: { newPassword: {}, confirmNewPassword: newPassword } })
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
      // empty <req.body.passwordData.newPassword field //
      it(`Should NOT change User password with an EMPTY <req.body.passwordData.newPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData: { newPassword: "", confirmNewPassword: newPassword } })
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
      // invalid <req.body.passwordData.confirmNewPassword field //
      it(`Should NOT change User password with an INVALID <req.body.passwordData.confirmNewPassword> FIELD TYPE and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData: { newPassword, confirmNewPassword: {} } })
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
      // empty <req.body.passwordData.confirmNewPassword field //
      it(`Should NOT change User password with an EMPTY <req.body.passwordData.confirmNewPassword> FIELD and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData: { newPassword, confirmNewPassword: "" } })
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
      // mismatching <req.body.passwordData.newPassword> and <req.body.passwordData.confirmNewPassword> fields //
      it(`Should NOT change User password with MISMATCHING <passwordData.newPassword> and <passwordData.confirmNewPassword> FIELDS and return a correct <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData: { newPassword, confirmNewPassword: "doesnotmatch" } })
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
    // END TEST empty, wrong type or incorrect <req.body.passwordData> fields //
    // retry login and ensure model was not changed //
    describe("Test LOGIN action with the queried User model and ensure no changes were made", () => {
      // ensure user can still login with the old password //
      it(`Should successfully LOGIN IN with the UNCHANGED User password and send back a correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: secondReaderUser.email, password: oldPassword })
          .end((err, response) => {
            const { responseMsg, userData, jwtToken, success, isAdmin, error, errorMessages } = response.body as LoginRes;
            if (err) done(err);
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(jwtToken).to.be.an("object");
            expect(success).to.equal(true);
            expect(isAdmin).to.equal(false);
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });   
      // ensure that the queried User model is unchanged //
      it("Should NOT alter any <User> or <Admin> models in the database in any way", async () => {
        try {
          const queriedUser: IUser = await User.findOne({ email: secondReaderUser.email });
          const updatedNumOfAdminModels: number = await Admin.countDocuments();
          const updatedNumOfUserModels: number = await User.countDocuments();
          //
          expect(queriedUser.toObject()).to.eql(secondReaderUser.toObject());
          expect(updatedNumOfAdminModels).to.equal(numOfAdminModels);
          expect(updatedNumOfUserModels).to.equal(numOfUserModels);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END TEST CONTEXT LOGGED IN ADMIN UsersControler:changePassword API calls INVALID DATA FIELDS - OTHER USERS ACCOUNT //

  // TEST CONTEXT LOGGED IN ADMIN UsersController:changePassword API calls VALID DATA FIELDS - OTHER USERS ACCOUNT //
  context("User Change Password - PATCH - ADMIN LOGGED IN - VALID DATA - OTHER USERS PROFILE", () => {
    let secondUsersId: string;
    //
    before(() => {
      secondUsersId = secondReaderUser._id.toHexString();
    });
    // TEST Admin changing/resetting User password, valid data //
    describe("PATCH /api/users/change_password - Admin Editing Password - ALL CORRECT FIELDS/DATA - OTHER USER PROFILE", () => {
      it(`Should correctyle edit Users password and send back the correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: adminUserJWTToken })
          .send({ userId: secondUsersId, passwordData })
          .end((err, response) => {
            if(err) done(err);
            const { editedUser, responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(editedUser).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
    });
    // END TEST Admin changing/resetting User password, valid data //
    // TEST login and ensure User model password was successfully changed //
    describe("Test LOGIN action with the queried User model and ensure ONlY PASSWROD was successfuly changed", () => {
      // ensure user can still login with the old password //
      it(`Should successfully LOGIN IN with the UPDATED User password and send back a correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .post("/api/login")
          .send({ email: secondReaderUser.email, password: newPassword })
          .end((err, response) => {
            const { responseMsg, userData, jwtToken, success, isAdmin, error, errorMessages } = response.body as LoginRes;
            if (err) done(err);
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(userData).to.be.an("object");
            expect(jwtToken).to.be.an("object");
            expect(success).to.equal(true);
            expect(isAdmin).to.equal(false);
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });   
      // ensure that the queried User model is unchanged //
      it("Should alter the queried User model and update only <password> and <editedAt> fields", async () => {
        try {
          const queriedUser: IUser = await User.findOne({ email: secondReaderUser.email });
          const updatedNumOfAdminModels: number = await Admin.countDocuments();
          const updatedNumOfUserModels: number = await User.countDocuments();
          // test what fields needed to be edited //
          expect(queriedUser._id.toHexString()).to.equal(secondReaderUser._id.toHexString());
          expect(queriedUser.email).to.equal(secondReaderUser.email);
          expect(queriedUser.firstName).to.equal(secondReaderUser.firstName);
          expect(queriedUser.lastName).to.equal(secondReaderUser.lastName);
          expect(queriedUser.createdAt.toString()).to.equal(secondReaderUser.createdAt.toString());
          // <editedAt> and <password> fields 
          expect(Date.parse(queriedUser.editedAt.toString())).to.be.gt(Date.parse(secondReaderUser.editedAt.toString()));
          expect(queriedUser.password).to.not.equal(secondReaderUser.password);
          // num of models shouldn't change //
          expect(updatedNumOfAdminModels).to.equal(numOfAdminModels);
          expect(updatedNumOfUserModels).to.equal(numOfUserModels);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END TEST CONTEXT LOGGED IN ADMIN UsersController:changePassword API calls VALID DATA FIELDS - OTHER USERS ACCOUNT //

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