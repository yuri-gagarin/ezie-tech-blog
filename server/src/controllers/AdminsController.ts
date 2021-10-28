import Admin from "../models/Admin";
import type { Request, Response } from "express";
import { BasicController } from "../_types/abstracts/DefaultController";
// 
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { FetchAdminsOpts, AdminsIndexRes, AdminsGetOneRes, AdminsEditRes, AdminsCreateRes, AdminsDeleteRes } from "../_types/admins/adminTypes";

export default class AdminsController extends BasicController implements ICRUDController {
  constructor() {
    super();
    this.create = this.create.bind(this);
  }
  index = async (req: Request, res: Response<AdminsIndexRes>): Promise<Response<AdminsIndexRes>> => {
    const { limit = 10 } = req.query as FetchAdminsOpts;
    try {
      const admins = await Admin.find({}).limit(limit).exec();
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
      const admin = await Admin.findOne({ _id: admin_id }).exec();
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
    const { email, password } = req.body;
    // validate input //
    if (!email || !password) {
      console.log(40);
      console.log(this)
      return await this.generalErrorResponse(res, { status: 400, error: new Error("Invalid input" )});
    }
    try {
      const createdAdmin = await Admin.create({ email, password, role: "admin", confirmed: false });
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
