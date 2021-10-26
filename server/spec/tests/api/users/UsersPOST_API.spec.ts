import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
//
import Admin from "../../../../src/models/Admin";
import User from "../../../../src/models/User";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { GetAllUsersRes, GetOneUserRes, ErrorUserRes } from "@/redux/_types/users/dataTypes";
import type { ResUserData } from "@/server/src/_types/users/userTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser, generateMockUserData } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("UsersController:Create POST API Tests", () => {
  // models //
  let adminUser: IAdmin;
  let confirmedRegUser: IUser;
  let unconfirmedRegUser: IUser;
  let mockUserData: ResUserData;
  // tokens //
  let adminJWTToken: string;
  let userJWTToken: string;
  // data counts //
  let numberOfUsers: number;
  let numberOfAdmins: number;
  //
  let server: Express;

  before(() => {
    server = ServerInstance.getExpressServer();
  });
  before(async () => {
    try {
      await generateMockAdmins(1);
      await generateMockUsers({ number: 5, confirmed: true });
      await generateMockUsers({ number: 5, confirmed: false });
      // adminUser //
      adminUser = await Admin.findOne({});
      confirmedRegUser = await User.findOne({}).where({ confirmed: true });
      unconfirmedRegUser = await User.findOne({}).where({ confirmed: false });
      // count data //
      numberOfAdmins = await Admin.countDocuments();
      numberOfUsers = await User.countDocuments(); 
      // mock user data //
      mockUserData = generateMockUserData();
    } catch (error) {
      throw error;
    }
  });
  // login admin //
  before(async () => {
    try {
      const { email } = adminUser;
      const tokenData = await loginUser({ chai, email, server });
      const regUserTokenData = await loginUser({ chai, server, email: confirmedRegUser.email });
      adminJWTToken = tokenData.userJWTToken;
      userJWTToken = regUserTokenData.userJWTToken;
    } catch (error) {
      throw (error);
    }
  })
  // CONTEXT GUEST User NO LOGIN //
  context("Guest client - no Login", () => {
    describe("POST /api/users - default response - valid data", () => {
      it("Should NOT create a new User model and send back correct response", (done) => {
        chai.request(server)
          .post("/api/users")
          .send({ userData: mockUserData })
          .end((err, response) => {
            if (err) done(err);
            // const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            //expect(responseMsg).to.be.a("string");
            //expect(error).to.be.an("object");
            //expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdUser).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new User model and alter the database in any way", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          // 
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          expect(updatedNumOfUsers).to.equal(numberOfUsers);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("POST /api/users - default response - invalid data", () => {
      it("Should NOT create a new User model and send back correct response", (done) => {
        chai.request(server)
          .post("/api/users")
          .send({ userData: {} })
          .end((err, response) => {
            if (err) done(err);
            //const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            //expect(responseMsg).to.be.a("string");
            //expect(error).to.be.an("object");
            //expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdUser).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new User model and alter the database in any way", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          // 
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          expect(updatedNumOfUsers).to.equal(numberOfUsers);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT GUEST User NO LOGIN //
  // CONTEXT User is logged in //
  context("User present - User IS Logged in", () => {
    describe("POST /api/users - default response - valid data", () => {
      it("Should NOT create a new User model and send back correct response", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: userJWTToken })
          .send({ userData: mockUserData })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdUser).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new User model and alter the database in any way", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          // 
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          expect(updatedNumOfUsers).to.equal(numberOfUsers);
        } catch (error) {
          throw error;
        }
      });
    });
    describe("POST /api/users - default response - invalid data", () => {
      it("Should NOT create a new User model and send back correct response", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: userJWTToken })
          .send({ userData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdUser).to.be.undefined;
            done();
          });
      });
      it("Should NOT create a new User model and alter the database in any way", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          // 
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          expect(updatedNumOfUsers).to.equal(numberOfUsers);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT User is logged in //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});

export {};