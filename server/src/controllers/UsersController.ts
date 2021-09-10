import type { Request, Response } from "express";
import User from "../models/User";
import { BasicController } from "../_types/abstracts/DefaultController";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { UsersIndexRes, UsersGetOneRes, UsersCreateRes, UsersEditRes, UsersDeleteRes } from "../_types/users/userTypes";

export default class UsersController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<UsersIndexRes>): Promise<Response<UsersIndexRes>> => {
    try {
      const users = await User.find({}).exec();
      return res.status(200).json({
        responseMsg: "Users returned", users
      });
    } catch (err) {
      return await this.generalErrorResponse(res, { error: new Error("DB Error") });
    }
  }
  getOne = async (req: Request, res: Response<UsersGetOneRes>): Promise<Response<UsersGetOneRes>> => {
    const { user_id } = req.params;
    if (!user_id) return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve user id") });

    try {
      const user = await User.findOne({ _id: user_id }).exec();
      if (user) {
        return res.status(200).json({
          responseMsg: "User found", user
        });
      } else {
        return await this.generalErrorResponse(res, { status: 404, error: new Error("User not found") });
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error: new Error("Database error") });
    }
  }
  create = async (req: Request, res: Response<UsersCreateRes>): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const createdUser = await User.create({ email, password });
      return res.status(200).json({
        responseMsg: "User found", createdUser
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  edit = async (req: Request, res: Response<UsersEditRes>): Promise<Response> => {
    const { user_id } = req.params;
    const { email, password, firstName, lastName } = req.body;
  
    if (!user_id) return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve user id")});

    try {
      const editedUser = await User.findOneAndUpdate({ _id: user_id }, { email, password, firstName, lastName }, { new: true }).exec();
      if (editedUser) {
        return res.status(200).json({ responseMsg: "Updated User model", editedUser });
      } else {
        return await this.generalErrorResponse(res, { status: 404, error: new Error("User to edit not found" )});
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  delete = async (req: Request, res: Response<UsersDeleteRes>): Promise<Response> => {
    const { user_id } = req.params;

    if (!user_id) return await this.generalErrorResponse(res, { status: 400, error: new Error("Could not resolve user id")});

    try {
      const deletedUser = await User.findOneAndDelete({ _id: user_id });
      if (deletedUser) {
        return res.status(200).json({
          responseMsg: `Deleted User ${deletedUser.email}`, deletedUser
        });
      } else {
        return await this.generalErrorResponse(res, { status: 400, error: new Error("User to delete not found") });
      }
    } catch (error) { 
      return await this.generalErrorResponse(res, { error });
    }
  }
};