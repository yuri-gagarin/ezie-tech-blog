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
import type { IProject } from "@/server/src/models/Project";
import type { EditProjectRes } from "@/redux/_types/projects/dataTypes";
import type { ProjectData } from "@/server/src/_types/projects/projectTypes";
// helpers //
import { generateMockAdmins, generateMockProjects, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { generateMockProjectData } from "../../../hepers/testHelpers";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

// At the moment only <owner> level admins should be able to PATCH any Project model //
describe("ProjectsController PATCH API tests", function () {
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
  let project: IProject;
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
      project = await Project.findOne({ published: true });
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
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST INVALID DATA //
    describe("PATCH /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("PATCH /api/projects/:project_id - default response - VALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
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
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST INVALID DATA //
    describe("PATCH /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: readerJWTToken })
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("PATCH /api/projects/:project_id - default response - VALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: readerJWTToken })
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
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
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST INVALID DATA //
    describe("PATCH /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: contributorJWTToken })
          .send({ projectData: {} })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("PATCH /api/projects/:project_id - default response - VALID data", function () {
      it ("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: contributorJWTToken })
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
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
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST INVALID DATA //
    describe("PATCH /api/projects/:project_id - default response - INVALID data", function () {
      it ("Should NOT alter the <Project> model with EMPTY data fields and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: adminJWTToken })
          .send({ projectData: { ...mockProjectData, title: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST INVALID DATA //
    // TEST VALID DATA //
    describe("PATCH /api/projects - default response - VALID data", function () {
      it ("Should NOT alter the <Project> model with EMPTY data fields and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: adminJWTToken })
          .send({ projectData: mockProjectData })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST VALID DATA //
  });
  // END TEST CONTEXT Admin Client LOGIN - ADMIN Level //

  // TEST CONTEXT Admin Client LOGIN - OWNER Level //
  context("Admin Client - LOGGED IN - <OWNER> Level", function () {
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
  
    // TEST INVALID DATA //
    describe("PATCH /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the <Project> model WITHOUT an <req.body.projectData> field in the request and send a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send()
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an EMPTY <title> field and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, title: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an INVALID <title> field TYPE and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, title: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an EMPTY <description> field and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, description: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an INVALID <description> field TYPE and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, description: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an EMPTY <challenges> field and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, challenges: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an INVALID <challenges> field TYPE and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, challenges: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an EMPTY <solutions> field and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, solution: "" } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> model with an INVALID <solutions> field TYPE and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData, solution: {} } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(400);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(editedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST INVALID DATA //

    // TEST VALID DATA //
    describe("PATCH /api/projects - default response - VALID data", function () {
      let _editedProject: ProjectData;
      it ("Should CORRECTLY alter the <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .patch(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .send({ projectData: { ...mockProjectData } })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, editedProject, error, errorMessages } = body as EditProjectRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(editedProject).to.be.an("object");
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            // 
            _editedProject = editedProject;
            done();
          });
      });
      it("Should CORRECTLY alter the <Project> models in the database", () => {
        // changed fields //
        expect(_editedProject.title).to.equal(mockProjectData.title);
        expect(_editedProject.description).to.equal(mockProjectData.description);
        expect(_editedProject.challenges).to.equal(mockProjectData.challenges);
        expect(_editedProject.solution).to.equal(mockProjectData.solution);
        expect(_editedProject.languages).to.eql(mockProjectData.languages);
        expect(_editedProject.frameworks).to.eql(mockProjectData.frameworks);
        expect(_editedProject.libraries).to.eql(mockProjectData.libraries);
        expect(_editedProject.editedAt).to.be.a("string");
        // fields which should remain the same //
        expect(_editedProject._id).to.equal(project._id.toHexString());
        expect(_editedProject.images).to.eql(project.images);
        expect(_editedProject.createdAt).to.equal(project.createdAt.toISOString());
      });
      it("Should NOT alter the number of <Project> models in the database", async () => {
        try {
          const updatedNumOfProjects: number = await Project.countDocuments();
          expect(updatedNumOfProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        } 
      });
    }); 
    // END TEST VALID DATA //
  });
  // END TEST CONTEXT Admin Client LOGIN - ADMIN Level //



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