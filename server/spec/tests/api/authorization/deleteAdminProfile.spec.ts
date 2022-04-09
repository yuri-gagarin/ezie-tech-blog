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
import { DeleteAdminProfileRes } from "@/server/src/_types/auth/authTypes";

chai.use(chaiHTTP);

describe("AuthController:deleteAdminProfile - Admin registration DELETE API tests", () => {
  let server: Express;
  //
  let ownerLevelUser: IAdmin; let secondOwnerLevelUser: IAdmin; let adminLevelUser: IAdmin; let secondAdminLevelUser: IAdmin;
  let regularUser: IUser;
  //
  let adminUserEmail: string; let secondAdminEmail: string; let ownerUserEmail: string; let secondOwnerUserEmail: string; let regUserEmail: string;
  let ownerUserToken: string; let secondOwnerUserToken: string; let adminUserToken: string; let secondAdminUserToken: string; let regUserToken: string; let secondRegUserToken: string;
  //
  let numOfUserModels: number = 0; let numOfAdminModels: number = 0;

  before(async () => {
    try {
      server = ServerInstance.getExpressServer();
      ([ adminLevelUser, secondAdminLevelUser ] = await generateMockAdmins(2, "admin"));
      ([ ownerLevelUser, secondOwnerLevelUser ] = await generateMockAdmins(2, "owner"));
      //
      regularUser = (await generateMockUsers({ number: 5, confirmed: true }))[0];
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
    ({ email: secondOwnerUserEmail } = secondOwnerLevelUser);
    ({ email: adminUserEmail } = adminLevelUser);
    ({ email: secondAdminEmail } = secondAdminLevelUser);
    ({ email: regUserEmail } = regularUser);
    // login tokens //
    ({ userJWTToken: ownerUserToken } = await loginUser({ chai, server, email: ownerUserEmail }));
    ({ userJWTToken: secondAdminUserToken } = await loginUser({ chai, server, email: secondOwnerUserEmail }));
    ({ userJWTToken: adminUserToken } = await loginUser({ chai, server, email: adminUserEmail }));
    ({ userJWTToken: regUserToken } = await loginUser({ chai, server, email: regUserEmail }));
  });

  /*
  // CONTEXT Admin profile delete no login //
  context("Admin Profile - DELETE - Admin NOT logged in", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete VALID data NOT logged in", () => {
      it("Should NOT delete Admin profile with WITHOUT a login TOKEN and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: "hgfdtdjjvcf" })
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
      it("Should NOT delete Admin profile with WITH and INCORRECT TOKEN SIGNATURE and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
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
      it("Should NOT alter the number of <User> or <Admin> models in the database", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Admin profile delete no login //

  // TEST CONTEXT Admin profile delete WITH Login Regular user //
  context("Admin Profile - DELETE - Regular User logged in", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete VALID data REGULAR User logged in", () => {
      it("Should NOT delete Admin profile with WITH a REGULAR USER TOKEN and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: regUserToken })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(403);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT alter the number of <User> or <Admin> models in the database", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END TEST CONTEXT Admin profile delete WIH Login Regular user //

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
      it("Should NOT delete Admin profile with an WRONG PASSWORD FIELD TYPE", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: {} })
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
      it("Should NOT delete Admin profile with an EMPTY PASSWORD FIELD", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: "" })
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
      it("Should NOT delete Admin profile with an INCORRECT PASSWORD FIELD", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: "notacorrectpassword" })
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
      it("Should NOT alter the number of Admin nor User models in the database", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
          //
          expect(adminModelCount).to.equal(numOfAdminModels);
          expect(userModelCount).to.equal(numOfUserModels);
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
  // END TEST DELETE /api/delete_admin_profle WITH Login  INVALID DATA //
  */
  // TEST CONTEXT Admin profile delete WITH Login <admin> level admin trying to delete another admin //
  context("Admin Profile - DELETE - Admin logged in <ADMIN> LEVEL Admin", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete VALID data <ADMIN> LEVEL trying to delete another Admin", () => {
      it("Should NOT delete other Admin profile  and return a correct response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: secondAdminEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as RegisterRes;
            expect(response.status).to.equal(403);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it("Should NOT alter the number of <User> or <Admin> models in the database", async () => {
        try {
          const updatedNumOfAdmins: number = await Admin.countDocuments();
          const updatedNumOfUsers: number = await User.countDocuments();
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END TEST CONTEXT Admin profile delete WITH Login <admin> level admin trying to delete another admin //

  // TEST DELETE Admin profile delete WITH Login VALID DATA own profile //
  context("Admin Profile - DELETE - Admin LOGGED IN - VALID DATA - OWN PROFILE", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete - VALID FORM DATA", () => {
      it("Should CORRECTLY delete Admin profile with and return the CORRECT response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should decrement the number of Admin models by 1", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
          //
          const nonExistingAdmin: IAdmin | null = await Admin.findOne({ email: adminUserEmail });
          //
          expect(adminModelCount).to.equal(numOfAdminModels - 1);
          expect(userModelCount).to.equal(numOfUserModels);
          expect(nonExistingAdmin).to.be.null;
          //
          numOfAdminModels = adminModelCount;
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
  // END TEST DELETE Admin profile delete WITH Login VALID DATA own profile //

  // TEST DELETE Admin profile delete WITH Login OWNER ADMIN - VALID DATA deleting another ADMIN LEVEL ADMIN //
  context("Admin Profile - DELETE - Admin LOGGED IN - VALID DATA - OWNER ADMIN DELETING another ADMIN LEVEL ADMIN", () => {
    describe("DELETE /api/delete_admin_profile - Admin profile Delete - VALID FORM DATA", () => {
      it("Should CORRECTLY delete another Admin profile with and return the CORRECT response", (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: ownerUserToken })
          .send({ email: secondAdminEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, deletedAdmin, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedAdmin).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            done();
          });
      });
      it("Should decrement the number of Admin models by 1", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
          //
          const nonExistingAdmin: IAdmin | null = await Admin.findOne({ email: adminUserEmail });
          //
          expect(adminModelCount).to.equal(numOfAdminModels - 1);
          expect(userModelCount).to.equal(numOfUserModels);
          expect(nonExistingAdmin).to.be.null;
          //
          numOfAdminModels = adminModelCount;
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
  // END TEST DELETE Admin profile delete WITH Login OWNER ADMIN - VALID DATA deleting another ADMIN LEVEL ADMIN //
  
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