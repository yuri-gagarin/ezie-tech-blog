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
  const notValidObjectId = "notavalidbsonobjectid";
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
  });
  // CONTEXT GUEST User NO LOGIN //
  
  context("Guest client - NO LOGIN", () => {
    let userId: string;
    before(() => {
      userId = confirmedRegUser._id.toHexString();
    });
    describe("PATCH /api/users/:user_id - default response - VALID DATA", () => {
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
          expect(queriedModel).to.not.be.null;
          expect(queriedModel.toObject()).to.eql(confirmedRegUser.toObject());
          
        } catch (error) {
          throw error;
        }
      });
    });
    describe("PATCH /api/users/:user_id - default response - INVALID DATA", () => {
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
          expect(queriedModel).to.not.be.null;
          expect(queriedModel.toObject()).to.eql(confirmedRegUser.toObject());
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT GUEST User NO LOGIN //

  // CONTEXT User is logged in //
  context("User Client - LOGGED IN - Regular User", () => {
    let userId: string;
    let unconfirmedUserId: string;
    let _editedUser: UserData; 
    before(() => {
      userId = confirmedRegUser._id.toHexString();
      unconfirmedUserId = unconfirmedRegUser._id.toHexString();
    });
    
    // CONTEXT User editing other users model //
    context("User is editing OTHER User's model", () => {
      describe("PATCH /api/users/:user_id - default response - VALID DATA", () => {
        it("Should NOT update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${unconfirmedUserId}`)
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
            expect(queriedModel).to.not.be.null;
            expect(queriedModel.toObject()).to.eql(confirmedRegUser.toObject());
          } catch (error) {
            throw error;
          }
        });
      });
      describe("PATCH /api/users/:user_id - default response - INVALID DATA", () => {
        it("Should NOT update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${unconfirmedUserId}`)
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
            expect(queriedModel).to.not.be.null;
            expect(queriedModel.toObject()).to.eql(confirmedRegUser.toObject());
          } catch (error) {
            throw error;
          }
        });
      });
    });
    // END CONTEXT User editing other users model //
    
    // CONTEXT User is editing own model //
    context("User editing own model", () => {
      describe("PATCH /api/users/:user_id - default response - VALID DATA", () => {
        it("Should correctly update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
            .send({ userData: { email: mockUserData.email, firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
            .end((err, response) => {
              if (err) done(err);
              const { status, body } = response;
              const { responseMsg, editedUser } = body as EditUserRes;
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
      
      describe("PATCH /api/users/:user_id - default response - INVALID DATA", () => {
        it("Should NOT update an EXISTING User model WITHOUT <userData> in <req.body>", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: adminJWTToken })
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
        it("Should NOT update an EXISTING User model WITH an INCORRECT <user_id> PARAM TYPE", (done) => {
          chai.request(server)
            .patch(`/api/users/${notValidObjectId}`)
            .set({ Authorization: adminJWTToken })
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
        it("Should NOT update an EXISTING User model with an EMPTY <email> field", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: adminJWTToken })
            .send({ userData: { email: "", firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
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
        it("Should NOT updated an EXISTING User model with an INVALID <email> field type", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: adminJWTToken })
            .send({ userData: { email: {}, firstName: mockUserData.firstName, lastName: mockUserData.lastName} })
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
        it("Should NOT updated an EXISTING User model with a duplicate <email> field", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: adminJWTToken })
            .send({ userData: { email: adminUser.email, firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
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
      
    });
    // END Context User editing own model //
  });
  // END CONTEXT User is logged in //

  // CONTEXT User is logged in //
  context("User is logged in - Regular User", () => {
    let userId: string;
    let unconfirmedUserId: string;
    let _editedUser: UserData; 
    before(() => {
      userId = confirmedRegUser._id.toHexString();
      unconfirmedUserId = unconfirmedRegUser._id.toHexString();
    });
    
    // CONTEXT User editing other users model //
    context("User is editing OTHER User's model", () => {
      describe("PATCH /api/users/:user_id - default response - valid data", () => {
        it("Should NOT update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${unconfirmedUserId}`)
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
            const queriedModel: IUser = await User.findById(unconfirmedUserId);
            // 
            expect(queriedModel).to.not.be.null;
            expect(queriedModel.toObject()).to.eql(unconfirmedRegUser.toObject());
          } catch (error) {
            throw error;
          }
        });
      });
      describe("PATCH /api/users/:user_id - default response - invalid data", () => {
        it("Should NOT update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${unconfirmedUserId}`)
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
            const queriedModel: IUser = await User.findById(unconfirmedUserId);
            // 
            expect(queriedModel).to.not.be.null;
            expect(queriedModel.toObject()).to.eql(unconfirmedRegUser.toObject());
          } catch (error) {
            throw error;
          }
        });
      });
    });
    // END CONTEXT User editing other users model //
    
    // CONTEXT User is editing own model //
    context("User editing own model", () => {
      describe("PATCH /api/users/:user_id - default response - valid data", () => {
        it("Should correctly update a User model and send back correct response", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
            .send({ userData: { email: mockUserData.email, firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
            .end((err, response) => {
              if (err) done(err);
              const { status, body } = response;
              const { responseMsg, editedUser } = body as EditUserRes;
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
      
      describe("PATCH /api/users/:user_id - default response - invalid data", () => {
        it("Should NOT update an EXISTING User model WITHOUT <userData> in <req.body>", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
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
        it("Should NOT update an EXISTING User model WITH an INCORRECT <user_id> PARAM TYPE", (done) => {
          chai.request(server)
            .patch(`/api/users/${notValidObjectId}`)
            .set({ Authorization: userJWTToken })
            .end((err, response) => {
              if (err) done(err);
              const { responseMsg, error, errorMessages } = response.body as ErrorUserRes;
              expect(response.status).to.equal(401);
              expect(responseMsg).to.be.a("string");
              expect(error).to.be.an("object");
              expect(errorMessages).to.be.an("array");
              //
              expect(response.body.createdPost).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT update an EXISTING User model with an EMPTY <email> field", (done) => {
          chai.request(server)
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
            .send({ userData: { email: "", firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
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
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
            .send({ userData: { email: {}, firstName: mockUserData.firstName, lastName: mockUserData.lastName} })
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
            .patch(`/api/users/${userId}`)
            .set({ Authorization: userJWTToken })
            .send({ userData: { email: adminUser.email, firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
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
      
    });
    // END Context User editing own model //
  });
  // END CONTEXT User is logged in //

  // CONTEXT Admin client is logged in //
  context("Admin client - LOGGED IN - ADMIN Level", function () {
    let otherUserId: string;
    let _editedUser: UserData; 
    let newMockData: ReqUserData;
    
    before(() => {
      otherUserId = unconfirmedRegUser._id.toHexString();
      newMockData = generateMockUserData();
    });

    context("Admin is editing ANY user model", () => {
      // TEST PATCH /api/users/:user_id INVALID DATA //
      describe("PATCH /api/users/:user_id - default response - INVALID data", () => {
        it("Should NOT update an EXISTING User model WITHOUT <userData> in <req.body", (done) => {
          chai.request(server)
            .patch(`/api/users/${otherUserId}`)
            .set({ Authorization: adminJWTToken })
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
        it("Should NOT update an EXISTING User model WITH an INCORRECT <user_id> PARAM TYPE", (done) => {
          chai.request(server)
            .patch(`/api/users/${notValidObjectId}`)
            .set({ Authorization: adminJWTToken })
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
        it("Should NOT update an EXISTING User model with an EMPTY <email> field", (done) => {
          chai.request(server)
            .patch(`/api/users/${otherUserId}`)
            .set({ Authorization: adminJWTToken})
            .send({ userData: { email: "", firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
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
            .patch(`/api/users/${otherUserId}`)
            .set({ Authorization: adminJWTToken })
            .send({ userData: { email: {}, firstName: mockUserData.firstName, lastName: mockUserData.lastName} })
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
            .patch(`/api/users/${otherUserId}`)
            .set({ Authorization: adminJWTToken })
            .send({ userData: { email: adminUser.email, firstName: mockUserData.firstName, lastName: mockUserData.lastName } })
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
            const queriedModel: IUser = await User.findById(otherUserId);
            // 
            expect(queriedModel).to.not.be.null;
            expect(queriedModel.toObject()).to.eql(unconfirmedRegUser.toObject());
          } catch (error) {
            throw error;
          }
        });
      });
      // END TEST PATCH /api/users/:user_id INVALID DATA //
    });
  });

  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      throw error;
    }
  });
});

