import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "@/server/src/server";
//
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
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
  let firstRegUser: IUser; let secondRegUser: IUser; let firstReaderUser: IUser;
  // admin models //
  let adminUser: IAdmin; let ownerAdminUser: IAdmin;
  // login tokens //
  let firstRegUserJWTToken: string; let secondRegUserJWTToken: string; let firstReaderUserJWTToken: string;
  let adminUserJWTToken: string; let ownerUserJWTToken: string;
  // data counts //
  let numberOfUsers: number;
  let numberOfAdmins: number;
  // response constants //
  const successResCode: number = 200;
  const badRequestResCode: number = 400;
  const unauthorizedResCode: number = 401;
  const forbiddenAccessCode: number = 403;
  const notFoundAccessCode: number = 404;
})