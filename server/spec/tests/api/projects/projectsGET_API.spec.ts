import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
//
import Admin from "../../../../src/models/Admin";
import User from "../../../../src/models/User";
import Project from "@/server/src/models/Project";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { IndexProjectRes } from "@/redux/_types/projects/dataTypes";
// helpers //
import { generateMockAdmins, generateMockProjects, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);
// At the moment only <owner> level admins should be able to GET an unpoublished Project model //
// <published> Project models should be available to all //
describe("ProjectsController GET API tests", function () {
  // custom timeout //
  this.timeout(5000);
  //
  let adminUser: IAdmin;
  let ownerUser: IAdmin;
  //
  let readerRegUser: IUser;
  let contributorRegUser: IUser;
  //
  let adminJWTToken: string;
  let ownerJWTToken: string;
  let readerJWTToken: string;
  let contributorJWTToken: string;
  //
  let server: Express;
  let numberOfProjects: number;

  // generate data, set server //
  before(async () => {
    try {
      await generateMockAdmins(1, "admin");
      await generateMockAdmins(1, "owner");
      await generateMockUsers({ number: 1, confirmed: true, type: "READER" });
      await generateMockUsers({ number: 1, confirmed: true, type: "CONTRIBUTOR" });
      // admins //
      adminUser = await Admin.findOne({ role: "admin" });
      ownerUser = await Admin.findOne({ role: "owner" });
      readerRegUser = await User.findOne({ userType: "READER" });
      contributorRegUser = await User.findOne({ userType: "CONTRIBUTOR" });
      //
      await generateMockProjects(5, { published: true, creator: ownerUser._id.toHexString() });
      await generateMockProjects(5, { published: false, creator: ownerUser._id.toHexString() });
      //
      numberOfProjects = await Project.countDocuments();
      server = ServerInstance.getExpressServer();
      //
    } catch (error) {
      throw error;
    }
  });
  // login all users  //
  before(async () => {
    try {
      ({ userJWTToken: adminJWTToken } = await loginUser({ chai, server, email: adminUser.email }));
      ({ userJWTToken: ownerJWTToken } = await loginUser({ chai, server, email: ownerUser.email }));
      ({ userJWTToken: readerJWTToken } = await loginUser({ chai, server, email: readerRegUser.email }));
      ({ userJWTToken: contributorJWTToken } = await loginUser({ chai, server, email: contributorRegUser.email }));
    } catch (error) {
      throw (error);
    }
  });
  // TEST CONTEXT Guest Client NO LOGIN //
  context("Guest CLient - NO LOGIN", function () {
    describe("GET /api/projects - default response", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .get("/api/projects")
          .end((err, response) => {
            if (err) done(err);
            //
            const { status, body } = response;
            const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
            //
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(projects).to.be.an("array")
            expect(projects.length).to.be.at.most(5);
            //
            for (const projectData of projects) {
              expect(projectData.published).to.equal(true);
            }
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            done();
          });
      });
      it ("Should NOT send back the reqested data if User requests <Project> models with <published> FALSE field", (done) => {
        chai
          .request(server)
          .get("/api/projects")
          .query({ published: false, limit: 5 })
          .end((err, response) => {
            if (err) done(err);
            //
            const { status, body } = response;
            const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
            //
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(projects).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    });
  })
  // END TEST CONTEXT Guest Client NO LOGIN //

  // TEST CONTEXT User Client READER with LOGIN //
  context("User CLient - READER - WITH LOGIN", function () {
    describe("GET /api/projects - default response", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .get("/api/projects")
          .set({ Authorization: readerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            //
            const { status, body } = response;
            const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
            //
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(projects).to.be.an("array")
            expect(projects.length).to.be.at.most(5);
            //
            for (const projectData of projects) {
              expect(projectData.published).to.equal(true);
            }
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            done();
          });
      });
      it ("Should NOT send back the reqested data if User requests <Project> models with <published> FALSE field", (done) => {
        chai
          .request(server)
          .get("/api/projects")
          .set({ Authorization: readerJWTToken })
          .query({ published: false })
          .end((err, response) => {
            if (err) done(err);
            //
            const { status, body } = response;
            const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
            //
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(projects).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    });
  })
  // END TEST CONTEXT User Client READER with LOGIN //

  // TEST CONTEXT User Client CONTRIBUTOR with LOGIN //
  context("User CLient - CONTRIBUTOR - WITH LOGIN", function () {
    describe("GET /api/projects - default response", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .get("/api/projects")
          .set({ Authorization: contributorJWTToken })
          .end((err, response) => {
            if (err) done(err);
            //
            const { status, body } = response;
            const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
            //
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(projects).to.be.an("array")
            expect(projects.length).to.be.at.most(5);
            //
            for (const projectData of projects) {
              expect(projectData.published).to.equal(true);
            }
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            done();
          });
      });
      it ("Should NOT send back the reqested data if User requests <Project> models with <published> FALSE field", (done) => {
        chai
          .request(server)
          .get("/api/projects")
          .set({ Authorization: contributorJWTToken })
          .query({ published: false })
          .end((err, response) => {
            if (err) done(err);
            //
            const { status, body } = response;
            const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
            //
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(projects).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    });
  })
  // END TEST CONTEXT User Client READER with LOGIN //

})