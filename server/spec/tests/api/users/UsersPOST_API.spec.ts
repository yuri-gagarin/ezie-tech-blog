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
import type { CreateUserRes, ErrorUserRes, UserData } from "@/redux/_types/users/dataTypes";
import type { ReqUserData } from "@/server/src/_types/users/userTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "@/server/src/_helpers/mockDataGeneration";
import { loginUser, generateMockUserData } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("UsersController:Create POST API Tests", () => {
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
  */
  // END CONTEXT GUEST User NO LOGIN //
  // CONTEXT User is logged in //
  /*
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
  */
  // END CONTEXT User is logged in //
  // CONTEXT Admin is logged in //
  context("Admin present - ADMIN User IS Logged in", () => {
    let _createdUser: UserData;
    // POST /api/users Invalid data //
    describe("POST /api/users - default response - invalid data", () => {
      it("Should NOT create a NEW User model with an EMPTY <email> field", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, email: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with an INVALID <email> field type", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, email: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with a duplicate <email> field", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, email: unconfirmedRegUser.email } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with an EMPTY <password> field", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, password: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with an INVALID <password> field TYPE", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, password: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with an EMPTY <confirmPassword> field", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, confirmPassword: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with an INVALID <confirmPassword> field TYPE", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, confirmPassword: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT create a NEW User model with a MISMATCHING <password> AND <confirmPassword> fields", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: { ...mockUserData, password: "password", confirmPassword: "password1" } })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.createdPost).to.be.undefined;
            // 
            done();
          });
      });
    });
    // END POST /api/users Invalid data //
    // POST /api/users valid data //
    describe("POST /api/users - default response - valid data", () => {
      it("Should create a new User model and send back correct response", (done) => {
        chai.request(server)
          .post("/api/users")
          .set({ Authorization: adminJWTToken })
          .send({ userData: mockUserData })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, createdUser } = response.body as CreateUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(createdUser).to.be.an("object");
            //
            expect(response.body.error).to.be.undefined;
            expect(response.body.errorMessages).to.be.undefined;
            // 
            _createdUser = createdUser;
            done();
          });
      });
      it("Should send back the correct User data in the response", () => {
        expect(_createdUser._id).to.be.a("string");
        expect(_createdUser.firstName).to.be.a("string");
        expect(_createdUser.lastName).to.be.a("string");
        expect(_createdUser.email).to.be.a("string");
        expect(_createdUser.editedAt).to.be.a("string");
        expect(_createdUser.createdAt).to.be.a("string");
        // user should not be confirmed and password should not be sent back //
        expect(_createdUser.confirmed).to.equal(false);
        expect(_createdUser.password).to.be.undefined;
      });
      it("Should create a new User model and increment the number of User models by 1", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          // 
          expect(updatedNumOfAdmins).to.equal(numberOfAdmins);
          expect(updatedNumOfUsers).to.equal(numberOfUsers + 1);
          // 
          numberOfUsers = updatedNumOfUsers;
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