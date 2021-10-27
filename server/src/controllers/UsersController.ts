import { BasicController } from "../_types/abstracts/DefaultController";
// models //
import User, { IUser } from "../models/User";
import Admin, { IAdmin } from "../models/Admin";
// types //
import type { Request, Response } from "express";
import type { ICRUDController } from "../_types/abstracts/DefaultController";
import type { UsersIndexRes, UsersGetOneRes, UsersCreateRes, UsersEditRes, UsersDeleteRes, ReqUserData } from "../_types/users/userTypes";
// helpers validators //
import { validateUserData, validateUniqueEmail, validateEditEmail } from "./_helpers/validationHelpers";

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
  // only Admin level users should be able to create any new additional users in DB //
  // for now //
  create = async (req: Request, res: Response<UsersCreateRes>): Promise<Response> => {
    const userData = req.body.userData as ReqUserData;
    // 
    if (!userData) return await this.userInputErrorResponse(res, [ "Invalid client data to create new User" ]);
    // validate new user data //
    const { valid, errorMessages } = validateUserData(userData);
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    // if valid data //
    try {
      // validate email and unique email //
      const { exists, message } = await validateUniqueEmail(userData.email);
      if (exists) return this.userInputErrorResponse(res, [ message ]);
      const createdUser = await User.create({ 
        email: userData.email, 
        password: userData.password,
        firstName: userData.firstName ? userData.firstName : "",
        lastName: userData.lastName ? userData.lastName : "",
        confirmed: false,
        editedAt: new Date(),
        createdAt: new Date()
      })
      return res.status(200).json({
        responseMsg: "User found",
        createdUser: {
          _id: createdUser._id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          confirmed: createdUser.confirmed,
          editedAt: createdUser.editedAt,
          createdAt: createdUser.createdAt
        }
      });
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  // only Admis level users OR Users editing own model should be able to edit //
  // middleware to check edit rights run before controller action //
  edit = async (req: Request, res: Response<UsersEditRes>): Promise<Response> => {
    const { user_id } = req.params;
    const userData = req.body.userData as ReqUserData;
  
    // validate input //
    const { valid, errorMessages } = validateUserData(userData, { existing: true });
    if (!valid) return await this.userInputErrorResponse(res, errorMessages);
    //
    try {
      const { exists, message } = await validateEditEmail(userData.email, user_id);
      if (exists) return await this.userInputErrorResponse(res, [ message ]);
      // data is checked and fine //
      const editedUser = await User.findOneAndUpdate(
        { _id: user_id }, 
        { email: userData.email, firstName: userData.firstName, lastName: userData.lastName, editedAt: new Date() }, 
        { new: true }).exec();
      if (editedUser) {
        return res.status(200).json({ responseMsg: "Updated User model", editedUser });
      } else {
        return await this.notFoundErrorResponse(res, [ "Could not resolve queried User model to edit" ]);
      }
    } catch (error) {
      return await this.generalErrorResponse(res, { error });
    }
  }
  // only Admis level users OR Users deleting own model should be able to delete //
  // middleware to check edit rights run before controller action //
  delete = async (req: Request, res: Response<UsersDeleteRes>): Promise<Response> => {
    const { user_id } = req.params;

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