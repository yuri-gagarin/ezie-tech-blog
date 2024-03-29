export type CustomErrorParams = {
  readonly message?: string;
  readonly errorMessages?: string[];
}

export class GeneralServerError extends Error {
  protected customErrorMessages: string[];
  constructor(message: string="General Server Error", customErrorMessages?: string[]) {
    super(message);
    this.customErrorMessages = customErrorMessages || [ "A server error occured" ];
    Object.setPrototypeOf(this, GeneralServerError.prototype);
  }

  public get getErrorMessages(): string[] {
    return this.customErrorMessages;
  }
};

export class AuthNotLoggedInError extends GeneralServerError {
  constructor(message: string = "Auth Not Logged In Error", customMessages?: string[]) {
    super(message, customMessages || ["You must be logged in to perform this action"]);
    Object.setPrototypeOf(this, AuthNotLoggedInError.prototype);
  }
};
export class AuthNotFoundError extends GeneralServerError {
  constructor(message: string = "Auth Not Found Error", customMessages?: string[]) {
    super(message, customMessages || ["Queried user was not found" ]);
    Object.setPrototypeOf(this, AuthNotFoundError.prototype);
  }
};

export class AuthWrongPassError extends GeneralServerError {
  constructor(message: string = "Auth Wrong Password Error", customMessages?: string[]) {
    super(message, customMessages || [ "Password entered for this user is incorrect" ]);
    Object.setPrototypeOf(this, AuthWrongPassError.prototype);
  }
};

export class AuthAccessLevelError extends GeneralServerError {
  constructor(data?: CustomErrorParams) {
    super(data && data.message || "Access Level Error", data && data.errorMessages || [ "Insufgicient access level "]);
    Object.setPrototypeOf(this, AuthAccessLevelError.prototype);
  }
}

export class InvalidDataError extends GeneralServerError {
  constructor(message: string = "Invalid Data Error", customMessages?: string[]) {
    super(message, customMessages || [ "Invalid client input" ]);
    Object.setPrototypeOf(this, InvalidDataError.prototype);
  }
};



