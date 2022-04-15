import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
import cookie from "cookie";
import parseHeaders from "parse-headers";
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
import type { DeleteAdminProfileRes } from "@/server/src/_types/auth/authTypes";
// helpers //
import { generateMockAdmins, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

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
  // response constants //
  const successResCode: number = 200;
  const badRequestResCode: number = 400;
  const unauthorizedResCode: number = 401;
  const forbiddenAccessCode: number = 403;

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

  // CONTEXT Admin profile delete no login //
  context("Admin Profile - DELETE - Admin NOT logged in", () => {
    describe("DELETE /api/delete_admin_profile - VALID DATA - NOT LOGGED IN", () => {
      it(`Should NOT delete Admin profile with WITHOUT a login TOKEN and return a correct <${unauthorizedResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: "" })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(unauthorizedResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete Admin profile with WITH an INCORRECT TOKEN SIGNATURE and return a correct <${unauthorizedResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(unauthorizedResCode);
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
          const queriedAdmin: IAdmin | null = await Admin.findOne({ email: adminUserEmail });
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(queriedAdmin).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END CONTEXT Admin profile delete no login //

  // TEST CONTEXT Admin profile delete WITH Login Regular user //
  context("Admin Profile - DELETE - Regular User logged in", () => {
    describe("DELETE /api/delete_admin_profile -  VALID DATA - REGULAR User logged in", () => {
      it(`Should NOT delete Admin profile with WITH a REGULAR USER TOKEN and return a correct ${forbiddenAccessCode} response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: regUserToken })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(forbiddenAccessCode);
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
          const queriedAdmin: IAdmin | null = await Admin.findOne({ email: adminUserEmail });
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(queriedAdmin).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
  });
  // END TEST CONTEXT Admin profile delete WIH Login Regular user //

  // TEST DELETE /api/delete_admin_profle WITH Login  INVALID DATA //
  context("Admin Profile - DELETE - Admin LOGGED IN - INVALID DATA - OWN PROFILE", () => {
    describe("DELETE /api/delete_admin_profile - INVALID FORM DATA", () => {
      it(`Should NOT delete Admin profile with an INVALID EMAIL FIELD TYPE and respond with <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: {}, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete Admin profile with an EMPTY EMAIL FIELD and respond with <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: "", password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete Admin profile with an WRONG PASSWORD FIELD TYPE and respond with <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: {} })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete Admin profile with an EMPTY PASSWORD FIELD and respond with <${badRequestResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: "" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(badRequestResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            done();
          });
      });
      it(`Should NOT delete Admin profile with an INCORRECT PASSWORD FIELD and respond with <${unauthorizedResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: "notacorrectpassword" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(unauthorizedResCode);
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
          const queriedAdmin: IAdmin | null = await Admin.findOne({ email: adminUserEmail });
          //
          expect(adminModelCount).to.equal(numOfAdminModels);
          expect(userModelCount).to.equal(numOfUserModels);
          expect(queriedAdmin).to.not.be.null;
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
  // END TEST DELETE /api/delete_admin_profle WITH Login  INVALID DATA //
  
  // TEST CONTEXT Admin profile delete WITH Login <ADMIN> level admin logged in with valid data //
  context("Admin Profile - DELETE - Admin LOGGED IN - VALID DATA - <ADMIN> LEVEL Admin", () => {

    // TEST DELETE another <ADMIN> level Admin profile //
    describe("DELETE /api/delete_admin_profile - VALID FORM DATA -  <ADMIN> LEVEL Admin deleting another <ADMIN> LEVEL Admin", () => {
      it(`Should NOT delete other Admin profile  and return a correct <${forbiddenAccessCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: secondAdminEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(forbiddenAccessCode);
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
          const queriedAdmin: IAdmin | null = await Admin.findOne({ email: secondAdminEmail });
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(queriedAdmin).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST DELETE another <ADMIN> level Admin profile //

    // TEST DELETE another <OWNER> level Admin profile //
    describe("DELETE /api/delete_admin_profile - VALID FORM DATA -  <ADMIN> LEVEL Admin deleting another <OWNER> LEVEL Admin", () => {
      it(`Should NOT delete other Admin profile  and return a correct <${forbiddenAccessCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: ownerUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(forbiddenAccessCode);
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
          const queriedAdmin: IAdmin | null = await Admin.findOne({ email: ownerUserEmail });
          //
          expect(updatedNumOfAdmins).to.equal(numOfAdminModels);
          expect(updatedNumOfUsers).to.equal(numOfUserModels);
          expect(queriedAdmin).to.not.be.null;
        } catch (error) {
          throw error;
        }
      });
    });
    // END TEST DELETE another <OWNER> level Admin profile //
    
    // TEST DELETE OWN <ADMIN> level Admin profile //
    describe("DELETE /api/delete_admin_profile - VALID FORM DATA - <ADMIN> Level Admin deleting own profile", () => {
      it(`Should CORRECTLY delete Admin profile with and return a correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: adminUserToken })
          .send({ email: adminUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, deletedAdmin, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            expect(deletedAdmin).to.be.undefined;
            // logout cookie should be sent //
            const [ _, jwtCookie ] = response.header['set-cookie'];
            const parsedJWTCookie = cookie.parse(jwtCookie);
            // current time for comparison ../
            const currentTime: number = new Date().getTime();
            const cookieExpiration: number = new Date(parsedJWTCookie.Expires as string).getTime();
            expect(parsedJWTCookie).to.be.an("object");
            expect(parsedJWTCookie.JWTToken).to.be.a("string");
            expect(cookieExpiration).to.be.lessThanOrEqual(currentTime);
            expect(parseInt(parsedJWTCookie['Max-Age'])).to.eq(0);
            done();
          });
      });
      it("Should decrement the number of Admin models by 1", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
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
  // END TEST CONTEXT Admin profile delete WITH Login <admin> level admin trying to delete another admin //

  // TEST DELETE Admin profile delete WITH Login OWNER ADMIN - VALID DATA  //
  context("Admin Profile - DELETE - Admin LOGGED IN - VALID DATA - <OWNER> LEVEL ADMIN", () => {
    // TEST owner deleting another admin level admin //
    describe("DELETE /api/delete_admin_profile - VALID FORM DATA - <OWNER> LEVEL Admin deleting another <ADMIN> LEVEL Admin", () => {
      it(`Should CORRECTLY delete another Admin profile with and return a correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: ownerUserToken })
          .send({ email: secondAdminEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, deletedAdmin, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(deletedAdmin).to.be.an("object");
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // logout cookie should not be sent //
            expect(response.header["set-cookie"]).to.be.an("array");
            expect(response.header["set-cookie"]).to.have.lengthOf(1);
            //
            const userIdCookie = cookie.parse(response.header["set-cookie"][0]);
            expect(userIdCookie.uniqueUserId).to.be.a("string");
            expect(userIdCookie.JWTToken).to.be.undefined;
            done();
          });
      });
      it("Should decrement the number of Admin models by 1", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
          //
          const nonExistingAdmin: IAdmin | null = await Admin.findOne({ email: secondAdminEmail });
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
    // END TEST owner deleting another <owner> level admin //

    // TEST owner deleting another <owner> level admin //
    describe("DELETE /api/delete_admin_profile - VALID FORM DATA - <OWNER> LEVEL Admin deleting another <ADMIN> LEVEL Admin", () => {
      it(`Should NOT delete another Admin profile with and return a correct <${forbiddenAccessCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: ownerUserToken })
          .send({ email: secondOwnerUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, deletedAdmin, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(forbiddenAccessCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            expect(deletedAdmin).to.be.undefined; // deletedAdmin object should not be sent back if deleting own profile //
            // logout cookie should not be sent //
            expect(response.header["set-cookie"]).to.be.an("array");
            expect(response.header["set-cookie"]).to.have.lengthOf(1);
            //
            const userIdCookie = cookie.parse(response.header["set-cookie"][0]);
            expect(userIdCookie.uniqueUserId).to.be.a("string");
            expect(userIdCookie.JWTToken).to.be.undefined;
            done();
          });
      });
      it("Should NOT change the number of Admin models", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
          const queriedAdmin: IAdmin | null = await Admin.findOne({ email: secondOwnerUserEmail });
          //
          expect(adminModelCount).to.equal(numOfAdminModels);
          expect(userModelCount).to.equal(numOfUserModels);
          expect(queriedAdmin).to.not.be.null;
          //
        } catch (error) {
          console.log(error);
        }
      });
    });
    // END TEST owner deleting another <owner> level admin //

    // TEST <OWNER> level admin deleting own profile //
    describe("DELETE /api/delete_admin_profile - VALID FORM DATA - <OWNER> LEVEL Admin deleting own profile", () => {
      it(`Should CORRECTLY delete another Admin profile with and return a correct <${successResCode}> response`, (done) => {
        chai.request(server)
          .delete("/api/delete_admin_profile")
          .set({ Authorization: ownerUserToken })
          .send({ email: ownerUserEmail, password: "password" })
          .end((err, response) => {
            if(err) done(err);
            const { responseMsg, deletedAdmin, error, errorMessages } = response.body as DeleteAdminProfileRes;
            expect(response.status).to.equal(successResCode);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            expect(deletedAdmin).to.be.undefined; // deletedAdmin object should not be sent back if deleting own profile //
            // logout cookie should be sent //
            const [ _, jwtCookie ] = response.header['set-cookie'];
            const parsedJWTCookie = cookie.parse(jwtCookie);
            // current time for comparison ../
            const currentTime: number = new Date().getTime();
            const cookieExpiration: number = new Date(parsedJWTCookie.Expires as string).getTime();
            expect(parsedJWTCookie).to.be.an("object");
            expect(parsedJWTCookie.JWTToken).to.be.a("string");
            expect(cookieExpiration).to.be.lessThanOrEqual(currentTime);
            expect(parseInt(parsedJWTCookie['Max-Age'])).to.eq(0);
            done();
          });
      });
      it("Should decrement the number of Admin models by 1", async () => {
        try {
          const adminModelCount = await Admin.countDocuments();
          const userModelCount = await User.countDocuments();
          //
          const nonExistingAdmin: IAdmin | null = await Admin.findOne({ email: ownerUserEmail });
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
    // END TEST <OWNER> level admin deleting own profile //
  
  });
  // END TEST DELETE Admin profile delete WITH Login OWNER ADMIN - VALID DATA  //

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