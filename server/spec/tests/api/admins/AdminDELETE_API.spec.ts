import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
//
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { ReqAdminData } from "@/server/src/_types/admins/adminTypes";
import type { AdminData, CreateAdminRes, EditAdminRes, ErrorAdminRes } from "@/redux/_types/admins/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { generateMockAdminData } from "../../../hepers/testHelpers";
import { loginUser } from "../../../hepers/testHelpers";
import { exec } from "child_process";

chai.use(chaiHTTP);

// NOTES //
// A Guest client, or regular User client both READER and CONTRIBUTOR should NOT have any access //
// Logged in Admin with <admin> role should ONLY be able to delete their OWN model //
// Logged in Admin with <owner> role should ONLY be able to delete their ANY model //
// 
describe("AdminsController:Edit PATCH API tests", function() {
  // custom timeout //
  this.timeout(10000);
  let server: Express;
  // model counts //
  let numberOfAdmins: number;
  // user models //
  let adminUser: IAdmin;
  let otherAdminUser: IAdmin;
  let ownerUser: IAdmin;
  let readerRegUser: IUser;
  let contributorRegUser: IUser;
  // login tokens //
  let adminJWTToken: string;
  let otherAdminJWTToken: string;
  let ownerJWTToken: string;
  let readerUserJWTToken: string;
  let contributorUserJWTToken: string;

  before(() => {
    server = ServerInstance.getExpressServer();
  });

  before(async () => {
    try {
      await generateMockAdmins(10, "admin");
      // generate owner level admin //
      await generateMockAdmins(1, "owner");
      await generateMockUsers({ number: 1, type: "READER" });
      await generateMockUsers({ number: 1, type: "CONTRIBUTOR" });
      // adminUser //
      ([ adminUser, otherAdminUser ] = await Admin.find({ role: "admin" }).limit(2));
      //
      ownerUser = await Admin.findOne({ role: "owner" });
      //
      readerRegUser = await User.findOne({ userType: "READER" });
      contributorRegUser = await User.findOne({ userType: "CONTRIBUTOR" });
      //
      numberOfAdmins = await Admin.countDocuments();
      //
    } catch (error) {
      throw error;
    }
  });

  // login admins users //
  before(async () => {
    try {
      const { email: adminEmail } = adminUser;
      const { email: otherAdminEmail } = otherAdminUser;
      const { email: ownerEmail } = ownerUser;
      const { email: readerEmail } = readerRegUser;
      const { email: contributorEmail } = contributorRegUser;
      //
      ({ userJWTToken: adminJWTToken  } = await loginUser({ chai, email: adminEmail, server }));
      ({ userJWTToken: otherAdminJWTToken } = await loginUser({ chai, email: otherAdminEmail, server }));
      ({ userJWTToken: ownerJWTToken  } = await loginUser({ chai, email: ownerEmail, server }));
      ({ userJWTToken: readerUserJWTToken  } = await loginUser({ chai, email: readerEmail, server }));
      ({ userJWTToken: contributorUserJWTToken  } = await loginUser({ chai, email: contributorEmail, server }));
    } catch (error) {
      throw (error);
    }
  });
});