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
  context("UsersController:updateUserPassword - NO LOGIN", () => {
    describe(`PATCH /api/users/change_password - VALID DATA - USER NOT LOGGED IN`, () => {
      it(`Should NOT delete User profile with WITHOUT a login token and return a correct <${unauthorizedResCode}> response`, (done) => {
        const userId: string = firstContributorUser._id.toHexString();
        chai.request(server)
          .patch("/api/users/change_password")
          .send({ newPassword: "newPassword", confirmNewPassword: "newPassword", oldPassword: "password", userId })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            console.log(response.body)
            expect(response.status).to.equal(unauthorizedResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete User profile with WITH an invalid login token and return a correct <${unauthorizedResCode}> response`, (done) => {
        const userId: string = firstContributorUser._id.toHexString();
        chai.request(server)
          .patch("/api/users/change_password")
          .set({ Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
          .send({ newPassword: "newPassword", confirmNewPassword: "newPassword", oldPassword: "password", userId })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as EditUserPassRes;
            console.log(response.body)
            expect(response.status).to.equal(unauthorizedResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      })
    })
  });
  // END CONTEXT UsersContreller:updateUserPassword no login //



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