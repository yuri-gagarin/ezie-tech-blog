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
// helpers //
import { generateMockAdmins, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { loginUser, generateMockUserData } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("UsersController:Edit PATCH API Tests", () => {
  // models //
  let adminUser: IAdmin;
  let confirmedRegUser: IUser;
  let unconfirmedRegUser: IUser;
  let mockUserData: ReqUserData;
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
  /*
  context("Guest client - no Login", () => {
    let userId: string;
    before(() => {
      userId = confirmedRegUser._id.toHexString();
    });
    describe("PATCH /api/users/:user_id - default response - valid data", () => {
      it("Should NOT update a User model and send back correct response", (done) => {
        chai.request(server)
          .patch(`/api/users/${userId}`)
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
      it("Should NOT alter the number of Admin or User models in the database", async () => {
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
      it("Should NOT alter the queried User model in any way", async () => {
        try {
          const queriedModel: IUser = await User.findById(userId);
          // 
          expect(queriedModel._id.toHexString()).to.equal(confirmedRegUser._id.toHexString());
          expect(queriedModel.firstName).to.equal(confirmedRegUser.firstName);
          expect(queriedModel.lastName).to.equal(confirmedRegUser.lastName);
          expect(queriedModel.email).to.equal(confirmedRegUser.email);
          expect(queriedModel.password).to.equal(confirmedRegUser.password);
          expect(queriedModel.confirmed).to.equal(confirmedRegUser.confirmed);
          expect(queriedModel.editedAt.toISOString()).to.equal(confirmedRegUser.editedAt.toISOString());
          expect(queriedModel.createdAt.toISOString()).to.equal(confirmedRegUser.createdAt.toISOString());
        } catch (error) {
          throw error;
        }
      });
    });
    describe("PATCH /api/users/:user_id - default response - invalid data", () => {
      it("Should NOT update a User model and send back correct response", (done) => {
        chai.request(server)
          .patch(`/api/users/${userId}`)
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
      it("Should NOT alter the number of Admin or User models in the database", async () => {
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
      it("Should NOT alter the queried User model in any way", async () => {
        try {
          const queriedModel: IUser = await User.findById(userId);
          // 
          expect(queriedModel._id.toHexString()).to.equal(confirmedRegUser._id.toHexString());
          expect(queriedModel.firstName).to.equal(confirmedRegUser.firstName);
          expect(queriedModel.lastName).to.equal(confirmedRegUser.lastName);
          expect(queriedModel.email).to.equal(confirmedRegUser.email);
          expect(queriedModel.password).to.equal(confirmedRegUser.password);
          expect(queriedModel.confirmed).to.equal(confirmedRegUser.confirmed);
          expect(queriedModel.editedAt.toISOString()).to.equal(confirmedRegUser.editedAt.toISOString());
          expect(queriedModel.createdAt.toISOString()).to.equal(confirmedRegUser.createdAt.toISOString());
        } catch (error) {
          throw error;
        }
      });
    });
  });
  */
  // END CONTEXT GUEST User NO LOGIN //
  // CONTEXT User is logged in //
  context("User is logged in - Regular User", () => {
    let userId: string;
    let _editedUser: UserData; 
    before(() => {
      userId = confirmedRegUser._id.toHexString();
    });
    context("User editing own model", () => {
      describe("PATCH /api/users/:user_id - default response - valid data", () => {
        it("Should correctly update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
            .send({ userData: { email: mockUserData.email, firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, editedUser } = response.body as EditUserRes;
              expect(response.status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(editedUser).to.be.an("object");
              //
              expect(response.body.error).to.be.undefined;
              expect(response.body.errorMessages).to.be.undefined;
              //
              _editedUser = editedUser;
              done();
            });
        });
        it("Should NOT alter the number of Admin or User models in the database", async () => {
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
        it("Should correctly alter the queried User model", () => {
            // 
          expect(_editedUser._id).to.equal(confirmedRegUser._id.toHexString());
          expect(_editedUser.firstName).to.equal(mockUserData.firstName);
          expect(_editedUser.lastName).to.equal(mockUserData.lastName);
          expect(_editedUser.email).to.equal(mockUserData.email);
          expect(_editedUser.editedAt).to.be.a("string");
          expect(_editedUser.createdAt).to.be.a("string");
        });
      });
      /*
      describe("PATCH /api/users/:user_id - default response - invalid data", () => {
        
      });
      */
    });
    // END Context User editing own model //
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