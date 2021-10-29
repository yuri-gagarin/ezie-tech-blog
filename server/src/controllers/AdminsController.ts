import Admin from "../models/Admin";
import { BasicController } from "../_types/abstracts/DefaultController";
// 
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { FetchAdminsOpts, ReqAdminData, AdminsIndexRes, AdminsGetOneRes, AdminsEditRes, AdminsCreateRes, AdminsDeleteRes } from "../_types/admins/adminTypes";
import { validateAdminData } from "./_helpers/validationHelpers";

export default class AdminsController extends BasicController implements ICRUDController {
  constructor() {
    super();
    this.create = this.create.bind(this);
  }
  index = async (req: Request, res: Response<AdminsIndexRes>): Promise<Response<AdminsIndexRes>> => {
    const { limit = 10 } = req.query as FetchAdminsOpts;
    try {
      const admins = await Admin.find({}, { password: 0 }).limit(limit).exec();
      return res.status(200).json({
        responseMsg: "Admins returned", admins
      });
    } catch (err) {
      return await this.generalErrorResponse(res, { error: new Error("DB Error") });
    }
  }
  getOne = async (req: Request, res: Response<AdminsGetOneRes>): Promise<Response<AdminsGetOneRes>> => {
    const { admin_id } = req.params;
    if (!admin_id) return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve admin id") });

    try {
      const admin = await Admin.findOne({ _id: admin_id }, { password: 0 }).exec();
      if (admin) {
        return res.status(200).json({
          responseMsg: "Admin found", admin
        });
      } else {
        return await this.generalErrorResponse(res, { status: 404, error: new Error("Admin not found") });
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error: new Error("Database error") });
    }
  }
  create = async (req: Request, res: Response<AdminsCreateRes>): Promise<Response> => {
    const adminData = req.body.adminData as ReqAdminData;
    // validate input //
    if (!adminData) return await this.userInputErrorResponse(res, [ "Could not resolve new Admin model data" ]);
    // validate new admin model data //
    const { valid, errorMessages } = validateAdminData(adminData);
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    //
    try {
      const { email, password, firstName = "", lastName = "" } = adminData;
      const newAdmin = await Admin.create({ 
        email, password, firstName, lastName, role: "admin", confirmed: true 
      });
      // remove the password field //
      const createdAdmin = newAdmin.toObject();
      delete createdAdmin.password;
      //
      return res.status(200).json({
        responseMsg: "Admin created", createdAdmin
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  edit = async (req: Request, res: Response<AdminsEditRes>): Promise<Response> => {
    const { admin_id } = req.params;
    const { email, password, firstName, lastName } = req.body;
  
    if (!admin_id) return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve admin id")});

    try {
      const editedAdmin = await Admin.findOneAndUpdate({ _id: admin_id }, { email, password, firstName, lastName }, { new: true }).exec();
      if (editedAdmin) {
        return res.status(200).json({ responseMsg: "Updated Admin model", editedAdmin });
      } else {
        return await this.generalErrorResponse(res, { status: 404, error: new Error("Admin to edit not found" )});
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  delete = async (req: Request, res: Response<AdminsDeleteRes>): Promise<Response> => {
    const { admin_id } = req.params;

    if (!admin_id) return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve admin id")});

    try {
      const deletedAdmin = await Admin.findOneAndDelete({ _id: admin_id });
      if (deletedAdmin) {
        return res.status(200).json({
          responseMsg: `Deleted Admin ${deletedAdmin.email}`, deletedAdmin
        });
      } else {
        return await this.generalErrorResponse(res, { status: 400, error: new Error("Admin to delete not found") });
      }
    } catch (error) { 
      return await this.generalErrorResponse(res, { error });
    }
  }
};
