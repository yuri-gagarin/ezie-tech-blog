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
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

describe("AuthController:deleteAdminProfile - Admin registration DELETE API tests", () => {
  let server: Express;
  //
  let ownerLevelUser: IAdmin;
  let adminLevelUser: IAdmin;
  let regularUser: IUser;
  //
  let adminUserEmail: string; let ownerUserEmail: string; let regUserEmail: string;
  let ownerUserToken: string; let adminUserToken: string; let regUserToken: string; let secondRegUserToken: string;
  //
  let numOfUserModels: number = 0; let numOfAdminModels: number = 0;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      adminLevelUser = (await generateMockAdmins(2, "admin"))[0];
      ownerLevelUser = (await generateMockAdmins(2, "owner"))[0];
      //
      const regUser = (await generateMockUsers({ number: 1, confirmed: true }))[0];
      // count models //
      numOfAdminModels = await Admin.countDocuments();
      numOfUserModels = await User.countDocuments();
    } catch (error) {
      throw(error);
    }
  });
  // login tokens //
  before(async () => {
    ({ email: ownerUserEmail } = ownerLevelUser);
    ({ email: adminUserEmail } = adminLevelUser);
    ({ email: regUserEmail } = regularUser);
    // login tokens //
    ({ userJWTToken: ownerUserToken } = await loginUser({ chai, server, email: ownerUserEmail }));
    ({ userJWTToken: adminUserToken } = await loginUser({ chai, server, email: adminUserEmail }));
    ({ userJWTToken: regUserToken } = await loginUser({ chai, server, email: regUserEmail }));
  });

  // TEST DELETE /api/delete_admin_profile NO Login //
  context("Admin Profile - DELETE - Admin NOT logged in", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete VALID data NOT logged in", () => {
      it("Should NOT delete Admin profile with WITHOUT a login and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: "" })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT alter the number of <User> models in the database", async () => {
        try {
          const updatedNumOfUsers: number = await Admin.countDocuments();
          expect(numOfUserModels).to.equal(updatedNumOfUsers);
        } catch (error) {
          throw error;
        }
      });
    })
  });
  // END TEST DELETE /api/delete_addmin_profile NO Login //

  // TEST DELETE /api/delete_admin_profle WITH Login  INVALID DATA //
  context("Admin Profile - DELETE - Admin LOGGED IN - INVALID DATA", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete - INVALID EMAIL DATA", () => {
      it("Should NOT delete Admin profile with an INVALID EMAIL FIELD TYPE", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: {}, password: "password" })
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
      it("Should NOT delete Admin profile with an EMPTY EMAIL FIELD", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: "", password: "password" })
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
      it("Should NOT alter the number of Admin models in the database", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          expect(adminModelCount).to.equal(numOfAdminModels);
        } catch (error) {
          console.log(error);
        }
      });
    });
  })

  // END TEST DELETE /api/delete_admin_profle WITH Login  INVALID DATA //

  // TEST Cleanup //
  after(async () => {
    try {
      await Admin.deleteMany({});
      await User.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });
});