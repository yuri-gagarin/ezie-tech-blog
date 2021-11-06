import Admin from "../../models/Admin";
//
import { respondWithNoModelIdError, respondWithNotAllowedError } from "./generalHelpers";
// types //
import type { Request, Response, NextFunction } from "express";
import type { IAdmin } from "../../models/Admin";
import type { ReqAdminData } from "../../_types/admins/adminTypes";
import type { ValidationRes } from "./validationHelpers";

export const verifyAdminModelPresent = (userModel: any): boolean => {
  return (userModel && userModel instanceof Admin);
}
export const verifyOwnerLevelAccess = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IAdmin;
  return verifyAdminModelPresent(user) && user.role === "owner" ? next() : respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
};

export const verifyAdminModelAccess = (req: Request, res: Response, next: NextFunction) => {
  const { admin_id } = req.params;
  const user = req.user as IAdmin;
  if (verifyAdminModelPresent(user) && user.role === "owner") {
    // can edit all //
    return admin_id ? next() : respondWithNoModelIdError(res, [ "Can't resolve Admin model id" ])
  } else if (verifyAdminModelPresent(user) && user.role === "admin") {
    // regular admins admins can only edit their own models //
    if (admin_id) {
      return user._id.equals(admin_id) ? next() : respondWithNotAllowedError(res, [ "Not allowed to edit other Admins" ]);
    } else {
      return respondWithNoModelIdError(res, [ "Could not resolve Admin model id" ]);
    } 
  } else {
    return respondWithNotAllowedError(res, [ "Action is not allowed" ]);
  }
};

// only owner level admin can change <Admin.role> or <Admin.confirmed> //
export const verifyAdminRoleOrConfirmationChange = (req: Request, res: Response, next: NextFunction) => {
  const adminData = req.body.adminData as ReqAdminData;
  const user = req.user as IAdmin
  if (adminData && (adminData.role || adminData.confirmed)) {
    return (verifyAdminModelPresent(user) && user.role === "owner") ? next() : respondWithNotAllowedError(res, [ "Insufficcient access level for action" ]);
  } else {
    // no role or confirmation changes //
    return next();
  }
};

export class AdminModelValidators {
  
  public static validateAdminData(data: { email?: string; password?: string; confirmPassword?: string; firstName?: string; lastName?: string; }, opts?: { existing?: boolean; }): ValidationRes {
    const errorMessages: string[] = [];
    if (!data.email) {
      errorMessages.push("Email is required");
    }
    if (!opts && !data.password) {
      errorMessages.push("Password is required");
    }
    if (!opts && !data.confirmPassword) {
      errorMessages.push("Password confirmation is required");
    }
  
    // validate correct types //
    if (data.email) {
      if (typeof data.email !== "string") {
        errorMessages.push("Wrong input for email");
      }
    }
    if (data.password && typeof data.password !== "string") {
      errorMessages.push("Wrong input for password");
    }
    if (data.confirmPassword && typeof data.confirmPassword !== "string") {
      errorMessages.push("Wrong input for password confirm");
    }
    if (data.password && data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        errorMessages.push("Passwords do not match");
      }
    }
    if (data.firstName && typeof data.firstName !== "string") {
      errorMessages.push("Wrong input type for first name field");
    }
    if (data.lastName && typeof data.lastName !== "string") {
      errorMessages.push("Wrong input type for last name field");
    }
    return errorMessages.length === 0 ? { valid: true, errorMessages } : { valid: false, errorMessages };
  };

  public static validateAdminRole(role?: string): ValidationRes {
    const allowedRoles = [ "admin", "owner" ];
    const errorMessages: string[] = [];
    if (!role) {
      errorMessages.push("Admin <role> field cannot be empty");
    }
    if (role) {
      if (typeof role !== "string") {
        errorMessages.push(`Admin <role> field must be a <string> type, got: <${typeof role}>. `);
      }
      if (!allowedRoles.some((allowed) => allowed === role)) {
        errorMessages.push(`Admin <role> field value <${role}> is incompatible with <Admin> model.`);
      }
    }
    return errorMessages.length === 0 ? { valid: true, errorMessages } : { valid: false, errorMessages };
  }

  
;}
