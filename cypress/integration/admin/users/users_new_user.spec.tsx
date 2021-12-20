/// <reference types="cypress" />
/// <reference types="cypress-pipe" />
import { expect } from "chai";
//
import faker from "faker";
//
import type { StaticResponse } from "cypress/types/net-stubbing";
import type { IGeneralState } from "@/redux/_types/generalTypes"
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import type { UserData, CreateUserRes, ErrorUserRes } from "@/redux/_types/users/dataTypes";
import type { LoginRes } from "@/redux/_types/auth/dataTypes";
import type { AdminData } from "@/redux/_types/users/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes"

// helpers //
import { deepCopyObject } from "@/components/_helpers/generalHelpers";
import { checkEmptyObjVals } from "@/redux/_helpers/dataHelpers";
import { capitalizeString, formatTimeString } from "../../../../components/_helpers/displayHelpers";
import { generateMockUserData } from "@/server/spec/hepers/testHelpers";

describe("Admin New Post page tests", () => {
  let appState: IGeneralState;
  let adminsArr: AdminData[];
  //
  let newUserData: ReqUserData;
  let newCreatedUser: UserData;
  let usersArr: UserData[];
  let mockErrorResponse: ErrorUserRes;
  //
  let adminJWTToken: string;
  let adminData: AdminData;
  //
  let adminIds: string[];
  let userIds: string[];

  const userRole: string[] = [ "READER", "CONTRIBUTOR" ];

  before(() => {
    try {
      cy.task("connectToDB")
        .then(() => {
          return cy.task<{ admins: AdminData[] }>("seedAdmins", { number: 1, role: "owner" });
        })
        .then(({ admins }) => {
          adminsArr = admins;
          adminData = adminsArr[0];
          adminIds = admins.map((adminData) => adminData._id);
          return cy.task<{ users: UserData[]}>("seedBlogPosts", { number: 10, role: userRole[0] })
        })
        .then(({ users }) => { 
          usersArr = users;
          userIds = usersArr.map((userData) => userData._id);
          const { email } = adminData;
          return cy.request<LoginRes>("POST", "api/login",  { email, password: "password" })
        })
        .then((loginData) => {
          const { jwtToken } = loginData.body;
          adminJWTToken = jwtToken.token;
        });
      //
    } catch (error) {
      throw error;
    }
  });

  before(() => {
    mockErrorResponse = { responseMsg: "Error Occured", error: new Error("Oooooops"), errorMessages: [ "An error occured" ]};
  });
});