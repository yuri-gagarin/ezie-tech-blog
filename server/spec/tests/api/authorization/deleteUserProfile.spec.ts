import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
// models //
import Admin from "@/server/src/models/Admin";
import User from "@/server/src/models/User";
// server //
// types //
import type { Express } from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { LoginRes, RegisterRes } from "@/redux/_types/auth/dataTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";

chai.use(chaiHTTP);

describe("AuthController:Register - User Registration API tests", () => {
  let server: Express;
  let adminUser: IAdmin;
  let regUser: IUser;
  let secondRegUser: IUser;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      await generateMockAdmins(1);
      await generateMockUsers({ number: 2, confirmed: true });
      adminUser = await Admin.findOne({});
      ([ regUser, secondRegUser ] = await User.find({}));
    } catch (error) {
      throw(error);
    }
  });

  // CONTEXT User profile delete invalid data //
  context("User Profile - DELETE - invalid data", () => {
    describe(" POST /api/delete_user_profile - User Delete with an INVALID EMAIL field", () => {
      it("Should NOT delete User profile and return a correct response", (done) => {
        chai.request(server)
          .post("/api/register")
          .send({ email: "", password: "password", confirmPassword: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
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