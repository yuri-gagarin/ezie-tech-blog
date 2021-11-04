import chai, { expect } from "chai";
import chaiHTTP from "chai-http";
// server //
import { ServerInstance } from "../../../../src/server";
//
import Admin from "../../../../src/models/Admin";
import User from "../../../../src/models/User";
import Project, { IProject } from "@/server/src/models/Project";
// types //
import type { Express} from "express";
import type { IAdmin } from "@/server/src/models/Admin";
import type { IUser } from "@/server/src/models/User";
import type { IndexProjectRes, OneProjectRes } from "@/redux/_types/projects/dataTypes";
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
  // CONTEXT TEST GET /api/projects //
  context("ProjectsController:Index action", function () {
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
        it("Should NOT alter the <Project> models in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects -  response with CUSTOM QUERY", function () {
        it ("Should NOT send back the reqested data with { published: true } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .query({ published: true, limit: 5 })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, projects, error, errorMessages } = body as IndexProjectRes;
              //
              console.log(body);
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
        it ("Should NOT send back the reqested data with { published: false } query", (done) => {
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

    });
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
        it("Should NOT alter the <Project> models in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects -  response with CUSTOM QUERY", function () {
        it ("Should NOT send back the reqested data with { published: true } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: readerJWTToken })
            .query({ published: true, limit: 5 })
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
        it ("Should NOT send back the reqested data with { published: false } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: readerJWTToken })
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

    });
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
        it("Should NOT alter the <Project> models in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects -  response with CUSTOM QUERY", function () {
        it ("Should NOT send back the reqested data with { published: true } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: contributorJWTToken })
            .query({ published: true, limit: 5 })
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
        it ("Should NOT send back the reqested data with { published: false } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: contributorJWTToken })
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

    });
    // END TEST CONTEXT User Client READER with LOGIN //

    // TEST CONTEXT Admin Client ADMIN level with login //
    context("Admin CLient - ADMIN Level - WITH LOGIN", function () {

      describe("GET /api/projects - default response", function () {
        it ("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: adminJWTToken })
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
        it("Should NOT alter the <Project> models in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects -  response with CUSTOM QUERY", function () {
        it ("Should NOT send back the reqested data with { published: true } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: adminJWTToken })
            .query({ published: true, limit: 5 })
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
        it ("Should NOT send back the reqested data with { published: false } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: adminJWTToken })
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

    });
    // TEST CONTEXT Admin Client ADMIN level with login //

    // TEST CONTEXT Admin Client OWNER level with login //
    context("Admin CLient - OWNER Level - WITH LOGIN", function () {

      describe("GET /api/projects - default response", function () {
        it ("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: ownerJWTToken })
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
        it("Should NOT alter the <Project> models in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects -  response with CUSTOM QUERY", function () {
        it("Should correctly send back the reqested data with { published: true } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: ownerJWTToken })
            .query({ published: true })
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
        it("Should correctly send back the reqested data with { published: false } query", (done) => {
          chai
            .request(server)
            .get("/api/projects")
            .set({ Authorization: ownerJWTToken })
            .query({ published: false })
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
                expect(projectData.published).to.equal(false);
              }
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
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

    });
    // TEST CONTEXT Admin Client ADMIN level with login //
    
  });
  // END CONTEXT TEST GET /api/projects //
  
  // CONTEXT TEST GET /api/projects/:projectId //
  context("ProjectsController:GetOne action", function () {
    let publishedProject: IProject;
    let unpublishedProject: IProject;
    //
    let publishedProjectId: string;
    let unpublishedProjectId: string;
    before(async () => {
      try {
        publishedProject = await Project.findOne({ published: true });
        unpublishedProject = await Project.findOne({ published: false });
        //
        publishedProjectId = publishedProject._id.toHexString();
        unpublishedProjectId = unpublishedProject._id.toHexString();
      } catch (error) {
        throw error;
      }
    });

    // TEST CONTEXT Guest Client NO LOGIN //
    context("Guest CLient - NO LOGIN", function () {

      describe("GET /api/projects/:project_id - PUBLISHED Project - default response", function () {
        it("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${publishedProjectId}`)
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(project).to.be.an("object")
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects/:project_id - UNPUBLISHED Project - default response", function () {
        it("Should NOT send back the reqested data and send a correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${unpublishedProjectId}`)
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(401);
              expect(responseMsg).to.be.a("string");
              expect(error).to.be.an("object");
              expect(errorMessages).to.be.an("array");
              //
              expect(project).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

    });
    // END TEST CONTEXT Guest Client NO LOGIN //

    // TEST CONTEXT User Client Logged in READER //
    context("User CLient - LOGGED IN - READER", function () {

      describe("GET /api/projects/:project_id - PUBLISHED Project - default response", function () {
        it("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${publishedProjectId}`)
            .set({ Authorization: readerJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(project).to.be.an("object")
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects/:project_id - UNPUBLISHED Project - default response", function () {
        it("Should NOT send back the reqested data and send a correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${unpublishedProjectId}`)
            .set({ Authorization: readerJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(401);
              expect(responseMsg).to.be.a("string");
              expect(error).to.be.an("object");
              expect(errorMessages).to.be.an("array");
              //
              expect(project).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

    });
    // END TEST CONTEXT User Client Logged in READER //

    // TEST CONTEXT User Client Logged in CONTRIBUTOR //
    context("User CLient - LOGGED IN - CONTRIBUTOR", function () {

      describe("GET /api/projects/:project_id - PUBLISHED Project - default response", function () {
        it("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${publishedProjectId}`)
            .set({ Authorization: contributorJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(project).to.be.an("object")
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects/:project_id - UNPUBLISHED Project - default response", function () {
        it("Should NOT send back the reqested data and send a correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${unpublishedProjectId}`)
            .set({ Authorization: contributorJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(401);
              expect(responseMsg).to.be.a("string");
              expect(error).to.be.an("object");
              expect(errorMessages).to.be.an("array");
              //
              expect(project).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

    });
    // END TEST CONTEXT User Client Logged in CONTRIBUTOR //

    // TEST CONTEXT Admin Client Logged in ADMIN Level //
    context("Admin CLient - LOGGED IN - ADMIN Level", function () {

      describe("GET /api/projects/:project_id - PUBLISHED Project - default response", function () {
        it("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${publishedProjectId}`)
            .set({ Authorization: adminJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(project).to.be.an("object")
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects/:project_id - UNPUBLISHED Project - default response", function () {
        it("Should NOT send back the reqested data and send a correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${unpublishedProjectId}`)
            .set({ Authorization: adminJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(401);
              expect(responseMsg).to.be.a("string");
              expect(error).to.be.an("object");
              expect(errorMessages).to.be.an("array");
              //
              expect(project).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

    });
    // TEST CONTEXT Admin Client Logged in ADMIN Level //

    // TEST CONTEXT Admin Client Logged in OWNER Level //
    context("Admin CLient - LOGGED IN - OWNER Level", function () {

      describe("GET /api/projects/:project_id - PUBLISHED Project - default response", function () {
        it("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${publishedProjectId}`)
            .set({ Authorization: ownerJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(project).to.be.an("object")
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

      describe("GET /api/projects/:project_id - UNPUBLISHED Project - default response", function () {
        it("Should correctly send back the reqested data with correct response", (done) => {
          chai
            .request(server)
            .get(`/api/projects/${publishedProjectId}`)
            .set({ Authorization: ownerJWTToken })
            .end((err, response) => {
              if (err) done(err);
              //
              const { status, body } = response;
              const { responseMsg, project, error, errorMessages } = body as OneProjectRes;
              //
              expect(status).to.equal(200);
              expect(responseMsg).to.be.a("string");
              expect(project).to.be.an("object")
              //
              expect(error).to.be.undefined;
              expect(errorMessages).to.be.undefined;
              // 
              done();
            });
        });
        it("Should NOT alter the <Project> models or its values in the database", async () => {
          try {
            const updatedNumOrProjects: number = await Project.countDocuments();
            const queriedProject: IProject = await Project.findOne({ _id: publishedProjectId });
            //
            expect(updatedNumOrProjects).to.equal(numberOfProjects);
            expect(queriedProject.toObject()).to.eql(publishedProject.toObject());
          } catch (error) {
            throw error;
          }
        });
      });

    });
    // TEST CONTEXT Admin Client Logged in ADMIN Level //

  });
  // END CONTEXT TEST GET /api/projects/:projectId //
  
  after(async () => {
    try {
      await Admin.deleteMany();
      await User.deleteMany();
      await Project.deleteMany();
    } catch (error) {
      throw error;
    }
  });
});