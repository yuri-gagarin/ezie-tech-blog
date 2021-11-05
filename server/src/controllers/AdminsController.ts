import Admin, { IAdmin } from "../models/Admin";
import { BasicController } from "../_types/abstracts/DefaultController";
// data enums //
// types //
import type { Request, Response } from "express";
import type { ICRUDController, IGenericClientController } from "../_types/abstracts/DefaultController";
import type { FetchAdminsOpts, ReqAdminData, PasswordChangeData, AdminsIndexRes, AdminsGetOneRes, AdminsEditRes, AdminsCreateRes, AdminsDeleteRes, AdminData } from "../_types/admins/adminTypes";
// helpers //
import { validateAdminData, validateUniqueEmail, validateEditEmail, validatePasswordChangeData } from "./_helpers/validationHelpers";

export default class AdminsController extends BasicController implements IGenericClientController {
  constructor() {
    super();
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
      // validate duplicate email //
      const { exists, message } = await validateUniqueEmail(email);
      if (exists) return await this.userInputErrorResponse(res, [ message ]);
      //
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
  // middleware should be run before this action //
  // middleware confirms login, admin access level //
  // admins can own their own model, sans <confirmed> AND <role> fields //
  // owners can edit all //
  edit = async (req: Request, res: Response<AdminsEditRes>): Promise<Response> => {
    const { admin_id } = req.params;
    const adminData = req.body.adminData as ReqAdminData;
    let editedAdmin: AdminData;
    // validate input //
    if (!adminData) return await this.userInputErrorResponse(res, [ "Could not resolve new Admin model data" ]);
    // validate new admin model data //
    const { valid, errorMessages } = validateAdminData(adminData, { existing: true });
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    

    try {
      const { email, firstName = "", lastName = "", role, confirmed } = adminData;
      // validate duplicate email //
      const { exists, message } = await validateEditEmail(email, admin_id);
      if (exists) return await this.userInputErrorResponse(res, [ message ]);
      //
      const editedAdminModel = await Admin.findOneAndUpdate(
        { _id: admin_id }, 
        { email, 
          firstName, 
          lastName, 
          role: role ? role : "admin",
          editedAt: new Date()
        }, 
        { new: true }).exec();
      if (editedAdminModel) {
        editedAdmin = editedAdminModel.toObject();
        delete editedAdmin.password;
        return res.status(200).json({ responseMsg: "Updated Admin model", editedAdmin });
      } else {
        return await this.generalErrorResponse(res, { status: 404, error: new Error("Admin to edit not found" )});
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  changePassword = async (req:Request, res: Response<AdminsEditRes>): Promise<Response> => {
    const { admin_id } = req.params;
    const passwordChangeData: { newPassword?: string; confirmNewPassword?: string; oldPassword?: string; } = req.body.passwordChangeData;
    let editedAdmin: AdminData;
    // validate password change data first //
    const { valid, errorMessages } = validatePasswordChangeData(passwordChangeData);
    if (!valid) return this.userInputErrorResponse(res, errorMessages);
    // attempt password change //
    // first check if old password is valid //
    try {
      const { newPassword, oldPassword } = passwordChangeData;
      const admin: IAdmin | null = await Admin.findOne({ _id: admin_id });
      if (admin) {
        if (await admin.validPassword(oldPassword)) {
          const updatedAdminWithPass: IAdmin = await admin.hashNewPassword(newPassword);
          editedAdmin = updatedAdminWithPass.toObject();
          delete editedAdmin.password;
          return res.status(200).json({ responseMsg: "Password changed", editedAdmin });
        } else {
          return this.notAllowedErrorResponse(res, [ "Seems like you entered a wrong current password" ]);
        }
      } else {
        return await this.notFoundErrorResponse(res, [ "Could not resolve queried Admin model" ]);
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
      // set logout cookie //
      if (deletedAdmin) {
        return (
          res
            .status(200)
            .json({ responseMsg: `Deleted Admin ${deletedAdmin.email}`, deletedAdmin })
        );
      } else {
        return await this.generalErrorResponse(res, { status: 400, error: new Error("Admin to delete not found") });
      }
    } catch (error) { 
      return await this.generalErrorResponse(res, { error });
    }
  }

  private processPasswordChange = async (res: Response<AdminsEditRes>, data: { adminId: string; passwordChangeData: PasswordChangeData }) => {
    const { adminId, passwordChangeData } = data;
    let editedAdmin: AdminData;
    // validate password change data first //
    const { valid, errorMessages } =  validatePasswordChangeData(passwordChangeData);
    if (!valid) return this.userInputErrorResponse(res, errorMessages);
    // attempt password change //
    // first check if old password is valid //
    try {
      const { newPassword, oldPassword } = passwordChangeData;
      const admin: IAdmin | null = await Admin.findOne({ _id: adminId });
      if (admin) {
        if (await admin.validPassword(oldPassword)) {
          const updatedAdminWithPass: IAdmin = await admin.hashNewPassword(newPassword);
          editedAdmin = updatedAdminWithPass.toObject();
          delete editedAdmin.password;
          return res.status(200).json({ responseMsg: "Password changed", editedAdmin });
        } else {
          return this.notAllowedErrorResponse(res, [ "Seems like you entered a wrong current password" ]);
        }
      } else {
        return await this.notFoundErrorResponse(res, [ "Could not resolve queried Admin model" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
};
