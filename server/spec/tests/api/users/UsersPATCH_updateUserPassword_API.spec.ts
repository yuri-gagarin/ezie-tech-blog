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
import type { EditUserRes, ErrorUserRes, UserData } from "@/redux/_types/users/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes";

describe("UsersController:updateUserPassword - PATCH - API Tests", () => {
  //
  let server: Express;
  const notValidObjectId = "notavalidbsonobjectid";
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