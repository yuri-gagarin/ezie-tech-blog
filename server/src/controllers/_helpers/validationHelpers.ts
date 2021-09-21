import { ValidationResponse } from "../../../../components/_helpers/validators";

export type ValidationRes = {
  valid: boolean;
  errorMessages: string[];
};

export const validateRegistrationData = (data: { email?: string; password?: string; confirmPassword?: string; }): ValidationResponse => {
  const res: ValidationRes = { valid: true, errorMessages: [] };
  if (!data.email) {
    res.errorMessages.push("Email is required");
    res.valid = false;
  }
  if (!data.password) {
    res.errorMessages.push("Password is required");
    res.valid = false;
  }
  if (!data.confirmPassword) {
    res.errorMessages.push("Password confirmation is required");
    res.valid = false;
  }
  if (data.password && data.confirmPassword) {
    if (data.password !== data.confirmPassword) {
      res.errorMessages.push("Passwords do not match");
      res.valid = false;
    }
  }
  return res;
};
