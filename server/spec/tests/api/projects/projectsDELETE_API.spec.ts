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
import type { DeleteProjectRes } from "@/redux/_types/projects/dataTypes";
import type { ProjectData } from "@/server/src/_types/projects/projectTypes";
// helpers //
import { generateMockAdmins, generateMockProjects, generateMockUsers } from "../../../../src/_helpers/mockDataGeneration";
import { loginUser } from "../../../hepers/testHelpers";

chai.use(chaiHTTP);

// At the moment only <owner> level admins should be able to DELETE any Project model //
describe("ProjectsController DELETE API tests", function () {
  // custom timeout //
  this.timeout(5000);
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

  const notValidBSONId: string = "notvalidbsonid";

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
    // TEST VALID DATA //
    describe("DELETE /api/projects/:project_id - default response - VALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${projectId}`)
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
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
    // TEST  INVALID DATA //
    describe("DELETE /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> WITH INVALID <project_id> PARAM model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${notValidBSONId}`)
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
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
  });
  // END CONTEXT GUEST Client NO LOGIN //

  // TEST CONTEXT User Client LOGGED IN READER //
  context("User CLient - LOGGED IN - READER", function () {
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST VALID DATA //
    describe("DELETE /api/projects/:project_id - default response - VALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${projectId}`)
          .set({ Authorization: readerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject).to.not.be.null;
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST VALID DATA //
    // TEST  INVALID DATA //
    describe("DELETE /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> WITH INVALID <project_id> PARAM model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${notValidBSONId}`)
          .set({ Authorization: readerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
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
  });
  // END TEST CONTEXT User Client LOGGED IN READER //

  // TEST CONTEXT User Client LOGGED IN CONTRIBUTOR //
  context("User CLient - LOGGED IN - CONRIBUTOR", function () {
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST VALID DATA //
    describe("DELETE /api/projects/:project_id - default response - VALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${projectId}`)
          .set({ Authorization: contributorJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject).to.not.be.null;
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST VALID DATA //
    // TEST  INVALID DATA //
    describe("DELETE /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> WITH INVALID <project_id> PARAM model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${notValidBSONId}`)
          .set({ Authorization: contributorJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
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
  });
  // END TEST CONTEXT User Client LOGGED IN CONTRIBUTOR //

  // TEST CONTEXT ADmin Client LOGGED IN ADMIN Level //
  context("Admin CLient - LOGGED IN - ADMIN Level", function () {
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST  INVALID DATA //
    describe("DELETE /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> WITH INVALID <project_id> PARAM model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${notValidBSONId}`)
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            expect(status).to.equal(401);
            //
            expect(body.deletedProject).to.be.undefined;
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
    describe("DELETE /api/projects/:project_id - default response - VALID data", function () {
      it("Should NOT alter the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${projectId}`)
          .set({ Authorization: adminJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, deletedProject, error, errorMessages  } = body as DeleteProjectRes;
            expect(status).to.equal(401);
            expect(responseMsg).to.be.a("string");
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(deletedProject).to.be.undefined;
            // 
            done();
          });
      });
      it("Should NOT alter the <Project> models in the database", async () => {
        try {
          const queriedProject: IProject = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject).to.not.be.null;
          expect(queriedProject.toObject()).to.eql(project.toObject());
          expect(updatedNumOrProjects).to.equal(numberOfProjects);
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST VALID DATA //
  });
  // TEST CONTEXT ADmin Client LOGGED IN ADMIN Level //

  // TEST CONTEXT ADmin Client LOGGED IN OWNER Level //
  context("Admin CLient - LOGGED IN - OWNER Level", function () {
    let projectId: string;
    
    before(() => {
      projectId = project._id.toHexString();
    });
    // TEST  INVALID DATA //
    describe("DELETE /api/projects/:project_id - default response - INVALID data", function () {
      it("Should NOT alter the queried <Project> WITH INVALID <project_id> PARAM model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${notValidBSONId}`)
          .set({ Authorization: ownerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            // this is default Passport middleware 401 response as of now //
            const { status, body } = response;
            const { responseMsg, deletedProject, error, errorMessages } = body as DeleteProjectRes;
            expect(status).to.equal(400);
            expect(error).to.be.an("object");
            expect(errorMessages).to.be.an("array");
            //
            expect(deletedProject).to.be.undefined;
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
    describe("DELETE /api/projects/:project_id - default response - VALID data", function () {
      it("Should DELETE the queried <Project> model and send back a correct response", (done) => {
        chai
          .request(server)
          .delete(`/api/projects/${projectId}`)
          .set({ Authorization: ownerJWTToken })
          .end((err, response) => {
            if (err) done(err);
            const { status, body } = response;
            const { responseMsg, deletedProject, error, errorMessages  } = body as DeleteProjectRes;
            expect(status).to.equal(200);
            expect(responseMsg).to.be.a("string");
            expect(deletedProject).to.be.an("object")
            //
            expect(error).to.be.undefined;
            expect(errorMessages).to.be.undefined;
            //
            done();
          });
      });
      it("Should REMOVE the queried <Project> model from the database and DECREMENT <Project> models by 1", async () => {
        try {
          const queriedProject: IProject | null = await Project.findById(projectId);
          const updatedNumOrProjects: number = await Project.countDocuments();
          expect(queriedProject).to.be.null;
          expect(updatedNumOrProjects).to.equal(numberOfProjects - 1);
          //
          numberOfProjects = updatedNumOrProjects;
        } catch (error) {
          throw error;
        }
      });
    }); 
    // END TEST VALID DATA //
  });
  // TEST CONTEXT ADmin Client LOGGED IN OWNER Level //
  after(async () => {
    try {
      await Admin.deleteMany();
      await User.deleteMany();
      await Project.deleteMany();
    } catch (error) {
      throw error;
    }
  })
});