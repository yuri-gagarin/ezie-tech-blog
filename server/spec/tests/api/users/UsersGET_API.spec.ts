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
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("UsersController GET API Tests", () => {
  let adminUser: IAdmin;
  let confirmedRegUser: IUser;
  let unconfirmedRegUser: IUser;
  let adminJWTToken: string;
  let userJWTToken: string;
  let server: Express;

  before(async () => {
    try {
      await generateMockAdmins(1);
      await generateMockUsers({ number: 1, confirmed: true });
      await generateMockUsers({ number: 1, confirmed: false });
      await generateMockUsers({ number: 10 });
      // adminUser //
      adminUser = await Admin.findOne({});
      confirmedRegUser = await User.findOne({}).where({ confirmed: true });
      unconfirmedRegUser = await User.findOne({}).where({ confirmed: false });
      //
      server = ServerInstance.getExpressServer();
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
  // CONTEXT LOGGED IN ADMIN //
  context("Logged In Admin", () => {
    describe("GET /api/users default response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=true  response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: adminJWTToken })
          .query({ confirmed: true })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=false  response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: adminJWTToken })
          .query({ confirmed: false })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(false);
            }
            done();
          });
      });
    });
    describe("GET /api/users/:user_id response", () => {
      it("Should be able to retreive an ACTIVE CONFIRMED User model and send back the correct response", (done) => {
        const userId: string = confirmedRegUser._id.toHexString();
        chai.request(server)
          .get(`/api/users/${userId}`)
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, user } = response.body as GetOneUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(user).to.be.an("object");
            expect(user.confirmed).to.equal(true);
            done();
          });
      });
      it("Should be able to retreive an INACTIVE UCONFIRMED User model and send back the correct response", (done) => {
        const userId: string = unconfirmedRegUser._id.toHexString();
        chai.request(server)
          .get(`/api/users/${userId}`)
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, user } = response.body as GetOneUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(user).to.be.an("object");
            expect(user.confirmed).to.equal(false);
            done();
          });
      });
    });
  });
  // END CONTEXT LOGGED IN ADMIN //
  // CONTEXT Logged in User /
  context("Logged In User", () => {
    describe("GET /api/users default response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: userJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=true  response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: userJWTToken })
          .query({ confirmed: true })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=false  response", () => {
      it("Should NOT be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .set({ Authorization: userJWTToken })
          .query({ confirmed: false })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.users).to.be.undefined;            
            done();
          });
      });
    });
    describe("GET /api/users/:user_id response", () => {
      it("Should be able to retreive an ACTIVE CONFIRMED User model and send back the correct response", (done) => {
        const userId: string = confirmedRegUser._id.toHexString();
        chai.request(server)
          .get(`/api/users/${userId}`)
          .set({ Authorization: userJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, user } = response.body as GetOneUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(user).to.be.an("object");
            expect(user.confirmed).to.equal(true);
            done();
          });
      });
      it("Should NOT be able to retreive an INACTIVE UCONFIRMED User model and send back the correct response", (done) => {
        const userId: string = unconfirmedRegUser._id.toHexString();
        chai.request(server)
          .get(`/api/users/${userId}`)
          .set({ Authorization: userJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.user).to.be.undefined;  
            done();
          });
      });
    });
  });
  // END CONTEXT LOGGED IN ADMIN //
  // CONTEXT GUEST User NO LOGIN //
  context("Guest client - no Login", () => {
    describe("GET /api/users default response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=true  response", () => {
      it("Should be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .query({ confirmed: true })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, users } = response.body as GetAllUsersRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(users).to.be.an("array");
            expect(users.length).to.be.at.most(10);
            for (const user of users) {
              expect(user.confirmed).to.equal(true);
            }
            done();
          });
      });
    });
    describe("GET /api/users?confirmed=false  response", () => {
      it("Should NOT be able to retreive User models and send back the correct response", (done) => {
        chai.request(server)
          .get("/api/users")
          .query({ confirmed: false })
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.users).to.be.undefined;            
            done();
          });
      });
    });
    describe("GET /api/users/:user_id response", () => {
      it("Should be able to retreive an ACTIVE CONFIRMED User model and send back the correct response", (done) => {
        const userId: string = confirmedRegUser._id.toHexString();
        chai.request(server)
          .get(`/api/users/${userId}`)
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, user } = response.body as GetOneUserRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(user).to.be.an("object");
            expect(user.confirmed).to.equal(true);
            done();
          });
      });
      it("Should NOT be able to retreive an INACTIVE UCONFIRMED User model and send back the correct response", (done) => {
        const userId: string = unconfirmedRegUser._id.toHexString();
        chai.request(server)
          .get(`/api/users/${userId}`)
          .end((err, response) => {
            if (err) done(err);
            const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(response.body.user).to.be.undefined;  
            done();
          });
      });
    });
  });
  // END CONTEXT GUEST User NO LOGIN //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});

export {}