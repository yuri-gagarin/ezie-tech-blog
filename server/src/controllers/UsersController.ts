import type { Request, Response } from "express";
import User, { IUser } from "../models/User";
import Admin, { IAdmin } from "../models/Admin";
import { BasicController } from "../_types/abstracts/DefaultController";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { UsersIndexRes, UsersGetOneRes, UsersCreateRes, UsersEditRes, UsersDeleteRes } from "../_types/users/userTypes";

export default class UsersController extends BasicController implements ICRUDController {
  index = async (req: Request, res: Response<UsersIndexRes>): Promise<Response<UsersIndexRes>> => {
    const { limit = 10, confirmed } = req.query as { limit?: number; confirmed?: string; };
    const user = req.user as IUser | IAdmin | null;
    //
    let users: IUser[];
    const allowedQuery = this.getUsersIndexPermission({ query: { confirmed }, user });
    if (allowedQuery) {
      try {
        if (confirmed && confirmed === "false") {
          users = await User.find({ confirmed: false }).sort({ createdAt: "desc" }).limit(limit).exec();
        } else if (confirmed && confirmed === "true") {
          users = await User.find({ confirmed: true }).sort({ createdAt: "desc"}).limit(limit).exec();
        } else {
          users = await User.find({ confirmed: true }).sort({ createdAt: "desc"}).limit(limit).exec();
        }
        return res.status(200).json({
          responseMsg: "Fetched users", users
        });
      } catch (err) {
        return await this.generalErrorResponse(res, { error: new Error("DB Error") });
      }
    } else {
      return this.notAllowedErrorResponse(res, [ "Action not allowed" ]);
    }
  }
  getOne = async (req: Request, res: Response<UsersGetOneRes>): Promise<Response<UsersGetOneRes>> => {
    const { user_id } = req.params;
    const currentUser = req.user as IAdmin | IUser | null;

    if (!user_id) return await this.userInputErrorResponse(res, [ "Could not resolve User id" ]);
    //
    try {
      const user = await User.findOne({ _id: user_id }).exec();
      if (user) {
        if (this.getOneUserPermission({ user, currentUser })) {
          return res.status(200).json({
            responseMsg: "Retrieved queried User", user
          });
        } else {
          return this.notAllowedErrorResponse(res, [ "Not allowed to get User data" ]);
        }
      } else {
        return await this.notFoundErrorResponse(res, [ "Queried User not found" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
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

  // PRIVATE helper methods //
  private getUsersIndexPermission = ({ query, user }: { query: any, user: IUser | IAdmin | null}) => {
    if (query.confirmed && query.confirmed === "false") {
      // only admin can see unconfirmed //
      if (user && user instanceof Admin) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  private getOneUserPermission = ({ user, currentUser }: { user: IUser; currentUser: IAdmin | IUser | null }) => {
    if (user.confirmed) {
      // anynone can query <confirmed> User model //
      return true;
    } else {
      if (this.isAdmin(currentUser)) {
        return true;
      } else {
        return false;
      }
    }
  }

  private isAdmin = (user: IAdmin | IUser | null) => {
    if (user && user instanceof Admin) {
      return true;
    } else if (user && user instanceof User) {
      return false;
    } else {
      return false;
    }
  }
};