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
import type { CreateProjectRes } from "@/redux/_types/projects/dataTypes";
import type { ProjectData } from "@/server/src/_types/projects/projectTypes";

// helpers //
import { generateMockAdmins, generateMockProjects, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { generateMockProjectData } from "../../../hepers/testHelpers";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);
// At the moment only <owner> level admins should be able to POST an unpoublished Project model //

describe("ProjectsController POST API tests", function () {
  // custom timeout //
  this.timeout(5000);
  let mockProjectData: ProjectData;
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
      mockProjectData = generateMockProjectData();
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
    // TEST INVALID DATA //
    describe("POST /api/projects - default response - INVALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.createdProject).to.be.undefined;
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
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("POST /api/projects - default response - VALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.createdProject).to.be.undefined;
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
    // END TEST VALID DATA //
  });
  // END CONTEXT GUEST Client NO LOGIN //

  // TEST CONTEXT User Client LOGIN - READER //
  context("User Client - LOGGED IN - READER User", function () {
    // TEST INVALID DATA //
    describe("POST /api/projects - default response - INVALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: readerJWTToken })
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            console.log(body);
            expect(status).to.equal(401);
            //
            expect(body.createdProject).to.be.undefined;
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
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("POST /api/projects - default response - VALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: readerJWTToken })
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.createdProject).to.be.undefined;
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
    // END TEST VALID DATA //
  });
  // END TEST CONTEXT User Client LOGIN - READER //

  // TEST CONTEXT User Client LOGIN - CONTIBUTOR //
  context("User Client - LOGGED IN - CONTRIBUTOR User", function () {
    // TEST INVALID DATA //
    describe("POST /api/projects - default response - INVALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: contributorJWTToken })
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            console.log(body);
            expect(status).to.equal(401);
            //
            expect(body.createdProject).to.be.undefined;
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
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("POST /api/projects - default response - VALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: contributorJWTToken })
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.createdProject).to.be.undefined;
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
    // END TEST VALID DATA //
  });
  // END TEST CONTEXT User Client LOGIN - CONTRIBUTOR //

  // TEST CONTEXT Admin Client LOGIN - ADMIN Level //
  context("Admin Client - LOGGED IN - <ADMIN> Level", function () {
    // TEST INVALID DATA //
    describe("POST /api/projects - default response - INVALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: adminJWTToken })
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, createdProject, error, errorMessages } = body as CreateProjectRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(createdProject).to.be.undefined;
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
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("POST /api/projects - default response - VALID data", function () {
      it ("Should correctly send back the reqested data with correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: adminJWTToken })
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, createdProject, error, errorMessages } = body as CreateProjectRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(createdProject).to.be.undefined;
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
    // END TEST VALID DATA //
  });
  // END TEST CONTEXT Admin Client LOGIN - ADMIN Level //

  // TEST CONTEXT Admin Client LOGIN - OWNERLevel //
  context("Admin Client - LOGGED IN - <OWNER> Level", function () {
    // TEST INVALID DATA //
    describe("POST /api/projects - default response - INVALID data", function () {
      it ("Should NOT create a new <Project> model with an EMPTY <title> field and send back a correct response", (done) => {
        chai
          .request(server)
          .post("/api/projects")
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, title: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, createdProject, error, errorMessages } = body as CreateProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(createdProject).to.be.undefined;
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
    // END TEST INVALID DATA //
    
  });
  // END TEST CONTEXT ADmin Client LOGIN - OWNER //
});