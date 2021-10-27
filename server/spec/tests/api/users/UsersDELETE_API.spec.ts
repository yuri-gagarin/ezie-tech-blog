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
import type { DeleteUserRes, ErrorUserRes } from "@/redux/_types/users/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { loginUser, generateMockUserData } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("UsersController:Delete DELETE API Tests", () => {
  // models //
  let adminUser: IAdmin;
  let confirmedRegUser: IUser;
  let unconfirmedRegUser: IUser;
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
  // mock data generation //
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
    } catch (error) {
      throw error;
    }
  });
  // logins //
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
  });
  // GUEST Client without login //
  context("Guest Client - NO LOGIN", () => {
    let userId: string;
    before(() => {
      userId = confirmedRegUser._id.toHexString();
    });

    describe("DELETE /api/users/:user_id", () => {
      it ("Should NOT delete an existing User model and send back the correct response", (done) => {
        chai.request(server)
          .delete(`/api/users/${userId}`)
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            /*
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            */
            expect(response.body.deletedUser).to.be.undefined;
            done();
          })
      });
      it("Should NOT alter the queried User model the database in any way", async () => {
        try {
          const queriedUser = await User.findOne({ _id: userId });
          // compare //
          expect(queriedUser.email).to.equal(confirmedRegUser.email);
          expect(queriedUser.firstName).to.equal(confirmedRegUser.firstName);
          expect(queriedUser.lastName).to.equal(confirmedRegUser.lastName);
          expect(queriedUser.password).to.equal(confirmedRegUser.password);
          expect(queriedUser.confirmed).to.equal(confirmedRegUser.confirmed);
          expect(queriedUser.editedAt.toISOString()).to.equal(confirmedRegUser.editedAt.toISOString());
          expect(queriedUser.createdAt.toISOString()).to.equal(confirmedRegUser.createdAt.toISOString());
        } catch (error) {
          throw error;
        }
      });
      it("Shoud NOT alter the number of User or Admin models in the database in any way", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          // 
          expect(updatedNumOfUsers).to.equal(numberOfUsers);
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END GUEST Client without login //
  // Context User Logged in //
  context("User Client - A VALID User is logged in", () => {
    let userId: string;
    let otherUserId: string;
    before(() => {
      userId = confirmedRegUser._id.toHexString();
      otherUserId = unconfirmedRegUser._id.toHexString();
    });
    // TEST model does not belong to user //
    describe("DELETE /api/users/:user_id - User model DOES NOT BELONG to logged in User", () => {
      it ("Should NOT delete an existing User model and send back the correct response", (done) => {
        chai.request(server)
          .delete(`/api/users/${otherUserId}`)
          .set({ Authorization: userJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.deletedUser).to.be.undefined;
            done();
          })
      });
      it("Should NOT alter the queried User model the database in any way", async () => {
        try {
          const queriedUser = await User.findOne({ _id: otherUserId });
          // compare //
          expect(queriedUser.email).to.equal(unconfirmedRegUser.email);
          expect(queriedUser.firstName).to.equal(unconfirmedRegUser.firstName);
          expect(queriedUser.lastName).to.equal(unconfirmedRegUser.lastName);
          expect(queriedUser.password).to.equal(unconfirmedRegUser.password);
          expect(queriedUser.confirmed).to.equal(unconfirmedRegUser.confirmed);
          expect(queriedUser.editedAt.toISOString()).to.equal(unconfirmedRegUser.editedAt.toISOString());
          expect(queriedUser.createdAt.toISOString()).to.equal(unconfirmedRegUser.createdAt.toISOString());
        } catch (error) {
          throw error;
        }
      });
      it("Shoud NOT alter the number of User or Admin models in the database in any way", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          // 
          expect(updatedNumOfUsers).to.equal(numberOfUsers);
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST model does NOT belong to user //
    // TEST model belongs to logged in user //
    describe("DELETE /api/users/:user_id - User model DOES BELONG to logged in User", () => {
      it ("Should delete an existing User model and send back the correct response", (done) => {
        chai.request(server)
          .delete(`/api/users/${userId}`)
          .set({ Authorization: userJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, deletedUser} = response.body as DeleteUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedUser).to.be.an("object");
            //
            expect(deletedUser._id).to.be.a("string");
            expect(deletedUser.email).to.be.a("string");
            expect(deletedUser.firstName).to.be.a("string");
            expect(deletedUser.lastName).to.be.a("string");
            done();
          })
      });
      it("Should REMOVE  the queried User model from the database", async () => {
        try {
          const queriedUser: IUser | null = await User.findOne({ _id: userId });
          // compare //
          expect(queriedUser).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Shoud decrement number of User models in the database by 1", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          // 
          expect(updatedNumOfUsers).to.equal(numberOfUsers - 1);
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          // 
          numberOfUsers = updatedNumOfUsers;
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST Model belongs to User //
  });
  // END Context User is logged in //
  // CONTEXT Admin User is logged in //
  context("Admin Client - A VALID Admin is logged in", () => {
    let otherUserId: string;
    before(() => {
      otherUserId = unconfirmedRegUser._id.toHexString();
    });
     // TEST model DOES not belong to logged in Admin //
     describe("DELETE /api/users/:user_id - User model DOES NOT BELONG to logged in Admin", () => {
      it ("Should delete an existing User model and send back the correct response", (done) => {
        chai.request(server)
          .delete(`/api/users/${otherUserId}`)
          .set({ Authorization: adminJWTToken})
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, deletedUser} = response.body as DeleteUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedUser).to.be.an("object");
            //
            expect(deletedUser._id).to.be.a("string");
            expect(deletedUser.email).to.be.a("string");
            expect(deletedUser.firstName).to.be.a("string");
            expect(deletedUser.lastName).to.be.a("string");
            done();
          })
      });
      it("Should REMOVE  the queried User model from the database", async () => {
        try {
          const queriedUser: IUser | null = await User.findOne({ _id: otherUserId });
          // compare //
          expect(queriedUser).to.be.null;
        } catch (error) {
          throw error;
        }
      });
      it("Shoud decrement number of User models in the database by 1", async () => {
        try {
          const updatedNumOfUsers: number = await User.countDocuments();
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          // 
          expect(updatedNumOfUsers).to.equal(numberOfUsers - 1);
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          // 
          numberOfUsers = updatedNumOfUsers;
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST Model belongs to User //
  });
  // END CONTEXT Admin User is logged in //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});